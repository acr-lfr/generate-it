import ConfigExtendedBase from '@/interfaces/ConfigExtendedBase';
import generateOperationId from '@/lib/generate/generateOperationId';
import openApiTypeToTypscriptType from '@/lib/openapi/openApiTypeToTypscriptType';
import * as _ from 'lodash';
import ApiIs from '@/lib/helpers/ApiIs';
import oa3toOa2Body from '@/lib/openapi/oa3toOa2Body';
import generateTypeScriptInterfaceText from '@/lib/generate/generateTypeScriptInterfaceText';

class OpenAPIInjectInterfaceNaming {
  public config: any;
  public apiObject: any;

  constructor (jsObject: any, passedConfig?: ConfigExtendedBase) {
    this.apiObject = jsObject;
    this.config = passedConfig || {};
  }

  /**
   * Merges the parameter namings into the path objects
   * @return {{paths}|module.exports.apiObject|{}}
   */
  public async inject () {
    if (ApiIs.isOpenAPIorSwagger(this.apiObject)) {
      return await this.swaggerPathIterator(true);
    }
    if (this.isAsyncAPI2()) {
      return await this.asyncChannelIterator(true);
    }
    throw new Error('Unrecognised input format');
  }

  /**
   * Merges the injected request params into single interface objects
   */
  public async mergeParameters () {
    if (ApiIs.isOpenAPIorSwagger(this.apiObject)) {
      return await this.swaggerPathIterator(false);
    }
    if (this.isAsyncAPI2()) {
      return await this.asyncChannelIterator(false);
    }
    throw new Error('Unrecognised input format');
  }

  /**
   * @param {string} ref
   * @return {string}
   */
  public convertRefToOjectPath (ref: string): string {
    const pathParts: string[] = [];
    const refParts = ref.split('/');
    for (let i = 0; i < refParts.length; ++i) {
      const part = refParts[i];
      if (part !== '#') {
        if (part.indexOf('.') !== -1) {
          throw new Error('Component or definition using . found, please do not use a period for namespacing for now.');
        }
        pathParts.push(part);
      }
    }
    return pathParts.join('.');
  }

  /**
   * True is apiobject is openapi
   * @return {boolean}
   */
  public isAsyncAPI2 () {
    return ApiIs.asyncapi2(this.apiObject);
  }

  /**
   * Injects x-[request|response]-definitions into the main object
   * @return {{paths}|module.exports.apiObject|{paths}|{}}
   */
  public async swaggerPathIterator (fromInject: boolean) {
    if (!this.apiObject.paths) {
      throw new Error('No paths found to iterate over');
    }
    for (const path in this.apiObject.paths) {
      if (!this.apiObject.paths.hasOwnProperty(path)) {
        continue;
      }
      for (const method in this.apiObject.paths[path]) {
        if (!this.apiObject.paths[path].hasOwnProperty(method)) {
          continue;
        }
        if (fromInject) {
          this.openApiXRequestInjector(path, method);
        } else {
          await this.mergeSwaggerInjectedParameters('paths', path, method);
        }
      }
    }
    return this.apiObject;
  }

  public async asyncChannelIterator (fromInject: boolean) {
    if (!this.apiObject.channels) {
      throw new Error('No paths found to iterate over');
    }
    for (const channel in this.apiObject.channels) {
      if (!this.apiObject.channels.hasOwnProperty(channel)) {
        continue;
      }
      if (fromInject) {
        this.asyncXRequestInjector(channel);
      } else {
        if (this.apiObject.channels[channel].subscribe) {
          await this.mergeSwaggerInjectedParameters('channels', channel, 'subscribe');
        }
        if (this.apiObject.channels[channel].publish) {
          await this.mergeSwaggerInjectedParameters('channels', channel, 'publish');
        }
      }
    }
    return this.apiObject;
  }

  /**
   * Injects the request and response object refs
   * @param channel
   */
  public asyncXRequestInjector (channel: string) {
    if (this.apiObject.channels[channel].publish) {
      this.apiObject.channels[channel].publish['x-request-definitions'] = this.injectRequestDefinitionsFromChannels(
        channel,
        'publish'
      );
      this.apiObject.channels[channel].publish['x-response-definitions'] = this.injectResponseDefinitionsFromChannels(
        channel,
        'publish'
      );
    }
    if (this.apiObject.channels[channel].subscribe) {
      this.apiObject.channels[channel].subscribe['x-request-definitions'] = this.injectRequestDefinitionsFromChannels(
        channel,
        'subscribe'
      );
      this.apiObject.channels[channel].subscribe['x-response-definitions'] = this.injectResponseDefinitionsFromChannels(
        channel,
        'subscribe'
      );
    }
  }

  /**
   * Injects the parameter paths to the subscribe/publish channels
   * @param channel
   * @param action
   */
  public injectRequestDefinitionsFromChannels (channel: string, action: string): object {
    const requestParams: any = {
      [action]: {
        name: _.upperFirst(),
        params: [],
      }
    };
    if (!this.apiObject.channels[channel].parameters) {
      return {};
    }
    for (const key in this.apiObject.channels[channel].parameters) {
      const p = this.apiObject.channels[channel].parameters[key];
      requestParams[action].params.push(
        this.convertRefToOjectPath(p.$ref || p.schema.$ref)
      );
    }
    return requestParams;
  }

  /**
   * Injects the object reference to the x-response-definitions
   * @param channel
   * @param action
   */
  public injectResponseDefinitionsFromChannels (channel: string, action: string) {
    let response: any = {};
    const pathResponses = this.apiObject.channels[channel][action].message || false;
    if (pathResponses && pathResponses.payload && pathResponses.payload.$ref) {
      let responseInterface = this.convertRefToOjectPath(
        pathResponses.payload.$ref
      );
      responseInterface = responseInterface.split('.').pop();
      if (responseInterface) {
        response = responseInterface;
      }
    }
    return response;
  }

  /**
   * Injects param/definition paths
   * @param {string} path - Path of api
   * @param {string} method - Method of path to x inject to
   */
  public openApiXRequestInjector (path: string, method: string) {
    this.apiObject.paths[path][method]['x-request-definitions'] = this.injectFromAPIPaths(path, method);
    this.apiObject.paths[path][method]['x-response-definitions'] = this.injectFromSwaggerResponse(path, method);
  }

  /**
   * Calculates and injects the parameters into the main api object
   * @param path
   * @param method
   * @return {{headers: [], path: [], query: [], body: []}}
   */
  public injectFromAPIPaths (path: string, method: string) {
    const requestParams: any = {
      body: {
        name: _.upperFirst(generateOperationId(_.upperFirst(method), path)),
        params: [],
      },
      formData: {
        name: _.upperFirst(generateOperationId(_.upperFirst(method) + 'FormData', path)),
        params: [],
      },
      header: {
        name: _.upperFirst(generateOperationId(_.upperFirst(method) + 'Headers', path)),
        params: [],
      },
      path: {
        name: _.upperFirst(generateOperationId(_.upperFirst(method) + 'Path', path)),
        params: [],
      },
      query: {
        name: _.upperFirst(generateOperationId(_.upperFirst(method) + 'Query', path)),
        params: [],
      },
    };
    this.apiObject.paths[path][method] = oa3toOa2Body(method, this.apiObject.paths[path][method]);
    if (this.apiObject.paths[path][method].parameters) {
      this.apiObject.paths[path][method].parameters.forEach((p: any) => {
        if (p.$ref || (p.schema && p.schema.$ref)) {
          const paramPath = this.convertRefToOjectPath(p.$ref || p.schema.$ref);
          const parameterObject = _.get(this.apiObject, paramPath);
          const paramType = parameterObject.in || p.in;
          try {
            if (paramType === 'body') {
              requestParams[paramType].params.push({
                name: p.name,
                path: paramPath,
              });
            } else {
              requestParams[paramType].params.push(paramPath);
            }
          } catch (e) {
            console.error('There was an error parsing a path and its referenced definitions, please check it is correct within the provided API specfication file'.red.bold);
            console.error('The path provided was: '.red + paramPath.red.bold);
            console.error('This is typically a result of a definition not defined in the index.'.red);
            console.error(parameterObject);
            console.error(paramPath, parameterObject, 'The full API object:');
            console.error(this.apiObject);
            throw e;
          }
        }
      });
    }
    return requestParams;
  }

  /**
   * Inject the interfaces for query|path|header paramters and leave the path to the body definition
   * @param action
   * @param path
   * @param method
   */
  public async mergeSwaggerInjectedParameters (action: string, path: string, method: string) {
    for (const requestType in this.apiObject[action][path][method]['x-request-definitions']) {
      if (!this.apiObject[action][path][method]['x-request-definitions'].hasOwnProperty(requestType)) {
        continue;
      }
      const requestObject: any = {};
      let clear = true;
      this.apiObject[action][path][method]['x-request-definitions'][requestType].params.forEach((requestPath: any) => {
        let parameterObject = _.get(this.apiObject, requestPath);
        clear = false;
        if (requestType !== 'body') {
          if (requestType === 'formData') {
            let name = '\'' + parameterObject.name + '\'';
            name += (!parameterObject.required) ? '?' : '';
            requestObject[name] = (ApiIs.swagger(this.apiObject) || ApiIs.openapi2(this.apiObject)) ?
              openApiTypeToTypscriptType(parameterObject.type) :
              openApiTypeToTypscriptType(parameterObject.schema.type);
          } else {
            const paramName = parameterObject.name;
            if (ApiIs.openapi3(this.apiObject) || ApiIs.asyncapi2(this.apiObject)) {
              // lift up the contents of schema
              parameterObject = {
                ...parameterObject,
                ...parameterObject.schema
              };
            }
            requestObject[paramName] = parameterObject;
          }
        }
      });
      if (!clear) {
        const interfaceName = this.apiObject[action][path][method]['x-request-definitions'][requestType].name;
        this.apiObject[action][path][method]['x-request-definitions'][requestType].interfaceText = (['body', 'formData'].includes(requestType))
          ? {outputString: this.objectToInterfaceString(requestObject, interfaceName)}
          : await generateTypeScriptInterfaceText(interfaceName, JSON.stringify({type: 'object', properties: requestObject}));
      } else {
        delete this.apiObject[action][path][method]['x-request-definitions'][requestType];
      }
    }
  }

  /**
   * Convert interface object to string (this is used for For
   * @param object
   * @param name
   * @return {string}
   */
  public objectToInterfaceString (object: any, name: string) {
    let text = `export interface ${name} {\n  `;
    const delim = (this.config.interfaceStyle === 'interface') ? ',' : ';';
    Object.keys(object).forEach((key) => {
      text += key + ':' + object[key] + delim;
    });
    return text + '  \n } ';
  }

  /**
   * Injects the request interface naming for the response objects
   * @param path
   * @param method
   * @return {{'200': null}}
   */
  public injectFromSwaggerResponse (path: string, method: string) {
    if (ApiIs.openapi3(this.apiObject)) {
      return this.injectFromOA3Response(path, method);
    }
    if (ApiIs.swagger(this.apiObject) || ApiIs.openapi2(this.apiObject)) {
      return this.injectFromOA2Response(path, method);
    }
  }

  public injectFromOA2Response (path: string, method: string): { '200': any } | {} {
    const response: any = {};
    const pathResponses = this.apiObject.paths[path][method].responses || false;
    if (pathResponses && pathResponses['200'] && pathResponses['200'].schema && pathResponses['200'].schema.$ref) {
      try {
        const responseInterface = this.convertRefToOjectPath(
          pathResponses['200'].schema.$ref
        )
          .split('.')
          .pop();
        if (responseInterface) {
          response['200'] = responseInterface;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return response;
  }

  public injectFromOA3Response (path: string, method: string): { '200': any } | {} {
    const response: any = {};
    const pathResponses = this.apiObject.paths[path][method].responses || false;
    if (pathResponses
      && pathResponses['200']
      && pathResponses['200'].content
      && pathResponses['200'].content['application/json']
      && pathResponses['200'].content['application/json'].schema
      && pathResponses['200'].content['application/json'].schema.$ref
    ) {
      try {
        const responseInterface = this.convertRefToOjectPath(pathResponses['200'].content['application/json'].schema.$ref).split('.').pop();
        if (responseInterface) {
          response['200'] = responseInterface;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return response;
  }
}

export default OpenAPIInjectInterfaceNaming;
