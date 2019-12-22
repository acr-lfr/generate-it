import Config from '@/interfaces/Config';
import * as _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import * as YAML from 'js-yaml';
import OpenAPIInjectInterfaceNaming from '@/lib/openapi/OpenAPIInjectInterfaceNaming';
import openApiResolveAllOfs from '@/lib/openapi/openApiResolveAllOfs';
import generateTypeScriptInterfaceText from '@/lib/generate/generateTypeScriptInterfaceText';
import logTimeDiff from '@/utils/logTimeDiff';

const RefParser = require('json-schema-ref-parser');

class OpenAPIBundler {
  /**
   *
   * @param filePath
   * @param config
   */
  public async bundle (filePath: string, config: Config) {
    let content;
    const startTime = new Date().getTime();
    logTimeDiff(0, 0);

    try {
      const filepath = path.resolve(__dirname, filePath);
      console.log('Reading file: ' + filePath);
      content = fs.readFileSync(filePath);
    } catch (e) {
      console.error('Can not load the content of the Swagger specification file');
      console.log(filePath);
      throw e;
    }

    logTimeDiff(startTime, new Date().getTime());

    try {
      console.log('Parsing file contents');
      content = this.parseContent(content);
    } catch (e) {
      console.error('Can not parse the content of the Swagger specification file');
      global.verboseLogging(content);
      throw e;
    }

    logTimeDiff(startTime, new Date().getTime());

    try {
      console.log('Injecting path interface names');
      content = (new OpenAPIInjectInterfaceNaming(content, config)).inject();
    } catch (e) {
      console.error('Cannot inject interface naming for:');
      global.verboseLogging(JSON.stringify(content, undefined, 2));
      throw e;
    }

    logTimeDiff(startTime, new Date().getTime());

    try {
      console.log('De-referencing object');
      content = await this.dereference(content);
    } catch (e) {
      console.error('Can not dereference the JSON obtained from the content of the Swagger specification file:');
      global.verboseLogging(JSON.stringify(content, undefined, 2));
      throw e;
    }

    logTimeDiff(startTime, new Date().getTime());

    try {
      console.log('Calculating all request definitions to interface relations');
      content = (new OpenAPIInjectInterfaceNaming(content, config)).mergeParameters();
    } catch (e) {
      console.error('Can not merge the request paramters to build the interfaces:');
      global.verboseLogging(JSON.stringify(content, undefined, 2));
      throw e;
    }

    logTimeDiff(startTime, new Date().getTime());

    try {
      console.log('Resolving all allOf references');
      content = openApiResolveAllOfs(content);
    } catch (e) {
      console.error('Could not resolve of allOfs');
      global.verboseLogging(JSON.stringify(content, undefined, 2));
      throw e;
    }

    logTimeDiff(startTime, new Date().getTime());

    try {
      console.log('Injecting interface texts');
      content = await this.injectInterfaces(content, config);
    } catch (e) {
      console.error('Cannot inject the interfaces: ');
      global.verboseLogging(JSON.stringify(content, undefined, 2));
      throw e;
    }

    logTimeDiff(startTime, new Date().getTime());

    try {
      console.log('Bundling the full object');
      content = await this.bundleObject(content);
    } catch (e) {
      console.error('Cannot bundle the object:');
      throw e;
    }
    global.verboseLogging(content);

    logTimeDiff(startTime, new Date().getTime());

    console.log('Injecting the endpoint names');
    return JSON.parse(JSON.stringify(
      this.pathEndpointInjection(content),
    ));
  }

  /**
   * JSON load and parse a .json file or .y(a)ml file
   * @param content
   */
  public parseContent (content: any) {
    content = content.toString('utf8');
    try {
      return JSON.parse(content);
    } catch (e) {
      return YAML.safeLoad(content);
    }
  }

  /**
   * Dereference the swagger/openapi object
   * @param json
   */
  public async dereference (json: object) {
    return RefParser.dereference(json, {
      dereference: {
        circular: 'ignore',
      },
    });
  }

  /**
   *
   * @param json
   */
  public async bundleObject (json: object) {
    return RefParser.bundle(json, {
      dereference: {
        circular: 'ignore',
      },
    });
  }

  /**
   * Iterates over the paths, methods and their calculated x-request-definitions to calculate the interface content.
   * @param apiObject Dereference'd' object
   * @param config
   * @return {Promise<void>}
   */
  public async injectInterfaces (apiObject: any, config: Config) {
    apiObject.interfaces = [];
    apiObject = await this.injectDefinitionInterfaces(apiObject, config);
    const pathsKeys = Object.keys(apiObject.paths);
    for (let i = 0; i < pathsKeys.length; ++i) {
      const singlePath = pathsKeys[i];
      const methods = Object.keys(apiObject.paths[singlePath]);
      for (let j = 0; j < methods.length; ++j) {
        const method = methods[j];
        const xRequestDefinitions = apiObject.paths[singlePath][method]['x-request-definitions'];
        if (xRequestDefinitions) {
          const xRequestDefinitionsKeys = Object.keys(xRequestDefinitions);
          for (let k = 0; k < xRequestDefinitionsKeys.length; ++k) {
            const paramType = xRequestDefinitionsKeys[k];
            if (xRequestDefinitions[paramType].interfaceText === '' && xRequestDefinitions[paramType].params.length > 0) {
              xRequestDefinitions[paramType].interfaceText = await generateTypeScriptInterfaceText(
                apiObject.paths[singlePath][method]['x-request-definitions'][paramType].name,
                JSON.stringify(_.get(
                  apiObject,
                  apiObject.paths[singlePath][method]['x-request-definitions'][paramType].params[0],
                )),
              );
            }
            apiObject.interfaces.push({
              name: apiObject.paths[singlePath][method]['x-request-definitions'][paramType].name,
              content: apiObject.paths[singlePath][method]['x-request-definitions'][paramType].interfaceText,
            });
          }
        }
      }
    }

    apiObject.interfaces = apiObject.interfaces.sort((a: any, b: any) => (a.name > b.name) ? 1 : -1);
    return apiObject;
  }

  /**
   * Iterates over the definitions already known to generate the respective interfaces
   * @param apiObject
   * @param config
   * @return apiObject
   */
  public async injectDefinitionInterfaces (apiObject: any, config: Config): Promise<any> {
    const defKeys = Object.keys(apiObject.definitions);
    for (let i = 0; i < defKeys.length; ++i) {
      const definitionObject = apiObject.definitions[defKeys[i]];
      try {
        apiObject.interfaces.push({
          name: defKeys[i],
          content: await generateTypeScriptInterfaceText(
            defKeys[i],
            JSON.stringify(definitionObject),
          ),
        });
      } catch (e) {
        console.log(defKeys[i]);
        console.log(e);
        throw new Error('Could not generate the interface text for the above object');
      }
    }
    return apiObject;
  }

  /**
   * Injects the end-points into each path object
   * @param apiObject
   */
  public pathEndpointInjection (apiObject: any) {
    apiObject.basePath = apiObject.basePath || '';
    _.each(apiObject.paths, (pathObject: any, pathName: string) => {
      pathObject.endpointName = pathName === '/' ? 'root' : pathName.split('/')[1];
    });

    apiObject.endpoints = _.uniq(_.map(apiObject.paths, 'endpointName'));
    return apiObject;
  }
}

export default new OpenAPIBundler();
