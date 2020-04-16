import Config from '@/interfaces/Config';
import * as _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import * as YAML from 'js-yaml';
import OpenAPIInjectInterfaceNaming from '@/lib/openapi/OpenAPIInjectInterfaceNaming';
import openApiResolveAllOfs from '@/lib/openapi/openApiResolveAllOfs';
import generateTypeScriptInterfaceText from '@/lib/generate/generateTypeScriptInterfaceText';
import logTimeDiff from '@/utils/logTimeDiff';
import ConfigExtendedBase from '@/interfaces/ConfigExtendedBase';
import ucFirst from '@/lib/template/helpers/ucFirst';
import ApiIs from '@/lib/helpers/ApiIs';

const RefParser = require('json-schema-ref-parser');

class OpenAPIBundler {
  /**
   *
   * @param filePath
   * @param config
   */
  public async bundle (filePath: string, config: Config) {
    let content;

    console.log('Reading file: ' + filePath);
    content = fs.readFileSync(filePath);
    this.copyInputFileToProject(filePath, config.targetDir);

    console.log('Parsing file contents');
    content = this.parseContent(content);

    console.log('Injecting path interface names');
    content = await (new OpenAPIInjectInterfaceNaming(content, config)).inject();

    console.log('De-referencing object');
    content = await this.dereference(content);

    console.log('Calculating all request definitions to interface relations');
    content = (new OpenAPIInjectInterfaceNaming(content, config)).mergeParameters();

    console.log('Resolving all allOf references');
    content = openApiResolveAllOfs(content);

    console.log('Injecting interface texts');
    content = await this.injectInterfaces(content, config);

    console.log('Injecting operationId array');
    content.operationIds = await this.fetchOperationIdsArray(content);

    console.log('Bundling the full object');
    content = await this.bundleObject(content);

    console.log('Injecting the endpoint names');
    return JSON.parse(JSON.stringify(
      this.pathEndpointInjection(content),
    ));
  }

  /**
   * Writes a copy of the input swagger file to the root of the project
   * @param filepath
   * @param targetDir
   */
  public copyInputFileToProject (filepath: string, targetDir: string): void {
    const saveTo = path.join(targetDir, 'openapi-nodegen-api-file.yml');
    console.log('Writing the input yml file to: ' + saveTo);
    fs.copyFileSync(filepath, saveTo);
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
   * Returns a simple array of uniqueOperationids from either asyncApi or swagger/openapi
   * @param yamlObject
   */
  public fetchOperationIdsArray (yamlObject: any): string[] {
    let ids = [];
    if (yamlObject.paths) {
      for (let pathMethod in yamlObject.paths) {
        if (yamlObject.paths[pathMethod].operationId) {
          ids.push(yamlObject.paths[pathMethod].operationId);
        }
      }
    } else if (yamlObject.channels) {
      for (let channel in yamlObject.channels) {
        if(yamlObject.channels[channel].subscribe){
          ids.push(yamlObject.channels[channel].subscribe.operationId);
        }
        if(yamlObject.channels[channel].publish){
          ids.push(yamlObject.channels[channel].publish.operationId);
        }
      }
    }
    return ids;
  }

  /**
   * Iterates over the paths, methods and their calculated x-request-definitions to calculate the interface content.
   * @param apiObject Dereference'd' object
   * @param config
   * @return {Promise<void>}
   */
  public async injectInterfaces (apiObject: any, config: ConfigExtendedBase) {
    apiObject.interfaces = [];
    apiObject = await this.injectDefinitionInterfaces(apiObject);
    if (ApiIs.swagger(apiObject) || ApiIs.openapi2(apiObject)) {
      apiObject = await this.injectParameterInterfaces(apiObject, config);
    }
    apiObject.interfaces = apiObject.interfaces.sort((a: any, b: any) => (a.name > b.name) ? 1 : -1);
    apiObject.interfaces = _.uniqBy(apiObject.interfaces, 'name');
    return apiObject;
  }

  /**
   * Iterates over the definitions already known to generate the respective interfaces
   * @param apiObject
   * @return apiObject
   */
  public async injectDefinitionInterfaces (apiObject: any): Promise<any> {
    // edge case for api's without any definitions or component schemas
    if (ApiIs.swagger(apiObject) && !apiObject.definitions
      || ApiIs.openapi3(apiObject) && (!apiObject.components || !apiObject.components.schemas)) {
      return apiObject;
    }
    const toWalk = (ApiIs.swagger(apiObject)) ? apiObject.definitions : (ApiIs.openapi3(apiObject) || ApiIs.asyncapi2(apiObject)) ? apiObject.components.schemas : {};
    const defKeys = Object.keys(toWalk);
    for (let i = 0; i < defKeys.length; ++i) {
      const definitionObject =
        (ApiIs.swagger(apiObject)) ?
          apiObject.definitions[defKeys[i]] :
          (ApiIs.openapi3(apiObject) || ApiIs.asyncapi2(apiObject)) ?
            apiObject.components.schemas[defKeys[i]] : {};
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
   * Iterates over all path generating interface texts from the json schema in the request definitions
   * @param apiObject
   * @param config
   */
  public async injectParameterInterfaces (apiObject: any, config: ConfigExtendedBase) {
    // iterate over paths with for loop so can use await later
    const pathsKeys = Object.keys(apiObject.paths);
    for (let i = 0; i < pathsKeys.length; ++i) {
      const thisPath = pathsKeys[i];
      const thisPathsMethods = Object.keys(apiObject.paths[thisPath]);

      // iterate over this paths methods, ie get/post/put etc
      for (let j = 0; j < thisPathsMethods.length; ++j) {
        const thisMethod = thisPathsMethods[j];
        const thisMethodXRequestionDefinitions = apiObject.paths[thisPath][thisMethod]['x-request-definitions'];

        if (!thisMethodXRequestionDefinitions) {
          continue;
        }

        // iterate over the request definitions
        const xRequestDefinitionsKeys = Object.keys(thisMethodXRequestionDefinitions);
        for (let k = 0; k < xRequestDefinitionsKeys.length; ++k) {
          const paramType = xRequestDefinitionsKeys[k];

          // handle request body
          if (paramType === 'body') {
            let param;
            try {
              param = apiObject.paths[thisPath][thisMethod]['x-request-definitions'][paramType].params[0];
              param.name = ucFirst(param.name);
            } catch (e) {
              console.error('Error with a body request parameter:');
              console.error(apiObject.paths[thisPath][thisMethod]['x-request-definitions'][paramType]);
              throw e;
            }
            thisMethodXRequestionDefinitions[paramType].interfaceText = await generateTypeScriptInterfaceText(
              param.name,
              JSON.stringify(_.get(
                apiObject,
                param.path,
              )),
            );
            apiObject.interfaces.push({
              name: param.name,
              content: thisMethodXRequestionDefinitions[paramType].interfaceText,
            });
          } else {
            // handle the rest
            apiObject.interfaces.push({
              name: apiObject.paths[thisPath][thisMethod]['x-request-definitions'][paramType].name,
              content: apiObject.paths[thisPath][thisMethod]['x-request-definitions'][paramType].interfaceText,
            });
          }
        }
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
