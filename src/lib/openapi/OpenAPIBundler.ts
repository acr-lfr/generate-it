import * as _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import * as YAML from 'js-yaml';
import OpenAPIInjectInterfaceNaming from '@/lib/openapi/OpenAPIInjectInterfaceNaming';
import openApiResolveAllOfs from '@/lib/openapi/openApiResolveAllOfs';
import generateTypeScriptInterfaceText from '@/lib/generate/generateTypeScriptInterfaceText';
import { ConfigExtendedBase } from '@/interfaces/ConfigExtendedBase';
import ucFirst from '@/lib/template/helpers/ucFirst';
import ApiIs from '@/lib/helpers/ApiIs';
import includeOperationNameAction from '@/lib/helpers/includeOperationNameAction';
import endpointNameCalculation from '@/lib/helpers/endpointNameCalculation';
import getBaseUrl from '@/lib/helpers/getBaseUrl';

const RefParser = require('json-schema-ref-parser');

class OpenAPIBundler {
  /**
   *
   * @param filePath
   * @param config
   */
  public async bundle (filePath: string, config: ConfigExtendedBase) {
    let content;

    content = fs.readFileSync(filePath);
    this.copyInputFileToProject(filePath, config.targetDir);

    content = this.parseContent(content);

    content = await (new OpenAPIInjectInterfaceNaming(content, config)).inject();

    content = await this.dereference(content);

    content = await (new OpenAPIInjectInterfaceNaming(content, config)).mergeParameters();

    content = openApiResolveAllOfs(content);

    content = await this.injectInterfaces(content, config);

    content.operationIds = await this.fetchOperationIdsArray(content);

    content = await this.bundleObject(content);

    if (!content.basePath) {
      content.basePath = getBaseUrl(content);
    }

    return JSON.parse(JSON.stringify(
      this.pathEndpointInjection(content, config),
    ));
  }

  /**
   * Writes a copy of the input swagger file to the root of the project
   * @param filepath
   * @param targetDir
   */
  public copyInputFileToProject (filepath: string, targetDir: string): void {
    const saveTo = path.join(targetDir, 'openapi-nodegen-api-file.yml');
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
    const ids: string[] = [];
    if (yamlObject.paths) {
      for (const pathMethod in yamlObject.paths) {
        if (yamlObject.paths[pathMethod].operationId) {
          const id = yamlObject.paths[pathMethod].operationId;
          if (!ids.includes(id)) {
            ids.push(id);
          }
        }
      }
    } else if (yamlObject.channels) {
      for (const channel in yamlObject.channels) {
        if (yamlObject.channels[channel].subscribe) {
          const subid = yamlObject.channels[channel].subscribe.operationId;
          if (!ids.includes(subid)) {
            ids.push(subid);
          }
        }
        if (yamlObject.channels[channel].publish) {
          const pubid = yamlObject.channels[channel].publish.operationId;
          if (!ids.includes(pubid)) {
            ids.push(pubid);
          }
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
    if (ApiIs.isOpenAPIorSwagger(apiObject)) {
      apiObject = await this.injectParameterInterfaces(apiObject);
    } else if (ApiIs.asyncapi2(apiObject)) {
      // TODO complete the parameters for async api apiObject = await this.injectParameterInterfacesFromAsyncApi(apiObject, config);
      // TODO this was left as not required for rabbitmq
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
   */
  public async injectParameterInterfaces (apiObject: any) {
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
   */
  public pathEndpointInjection (apiObject: any, config: ConfigExtendedBase) {
    apiObject.basePath = apiObject.basePath || '';
    const objects = apiObject.channels || apiObject.paths;
    apiObject.groupNamesWithFirstUrlSegment = {};
    for (const fullPath in objects) {
      const pathObject = objects[fullPath];
      let endpointName = '';
      if (fullPath === '/' || fullPath === '') {
        endpointName = 'root';
      } else {
        const parts = fullPath.split('/').filter(part => part.length > 0);
        endpointName = parts[0];
      }
      if (includeOperationNameAction(endpointName, pathObject, config.nodegenRc)) {
        pathObject.endpointName = endpointName;
        pathObject.groupName = endpointNameCalculation(fullPath, {
          segmentFirstGrouping: config.segmentFirstGrouping || config.nodegenRc.segmentFirstGrouping,
          segmentSecondGrouping: config.segmentSecondGrouping || config.nodegenRc.segmentSecondGrouping
        });
        if (!apiObject.groupNamesWithFirstUrlSegment[pathObject.groupName]) {
          apiObject.groupNamesWithFirstUrlSegment[pathObject.groupName] = pathObject.endpointName;
        }
      }
    }

    // Add all the endpoints in a single unique group
    apiObject.endpoints = _.uniq(_.map(apiObject.channels || apiObject.paths, 'endpointName')).filter((item: any) => {
      return typeof item === 'string';
    });

    return apiObject;
  }
}

export default new OpenAPIBundler();
