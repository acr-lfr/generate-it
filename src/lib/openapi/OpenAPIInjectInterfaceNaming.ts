import ConfigExtendedBase from '@/interfaces/ConfigExtendedBase';
import generateOperationId from '@/lib/generate/generateOperationId';
import openApiTypeToTypscriptType from '@/lib/openapi/openApiTypeToTypscriptType';
import * as _ from 'lodash';
import ApiIs from '@/lib/helpers/ApiIs';
import oa3toOa2Body from '@/lib/openapi/oa3toOa2Body';

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
  public inject () {
    if (this.isSwagger() || this.isOpenAPI3()) {
      return this.swaggerPathIterator(true);
    }
    throw new Error('Unrecognised input format');
  }

  /**
   * Merges the injected request params into single interface objects
   */
  public mergeParameters () {
    if (this.isOpenAPI3()) {
      return this.swaggerPathIterator(false);
    }
    if (this.isSwagger()) {
      return this.swaggerPathIterator(false);
    }
  }

  /**
   * @param {string} ref
   * @return {string}
   */
  public convertRefToOjectPath (ref: string): string {
    const pathParts: string[] = [];
    ref.split('/').forEach((part) => {
      if (part !== '#') {
        pathParts.push(part);
      }
    });
    return pathParts.join('.');
  }

  /**
   * True is apiobject is swagger
   * @return {boolean}
   */
  public isSwagger () {
    return ApiIs.swagger(this.apiObject);
  }

  /**
   * True is apiobject is openapi
   * @return {boolean}
   */
  public isOpenAPI3 () {
    return ApiIs.openapi3(this.apiObject);
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
  public swaggerPathIterator (fromInject: boolean) {
    if (!this.apiObject.paths) {
      throw new Error('No paths found to iterate over');
    }
    Object.keys(this.apiObject.paths).forEach((path) => {
      Object.keys(this.apiObject.paths[path]).forEach((method) => {
        if (fromInject) {
          this.xRequestInjector(path, method);
        } else {
          this.mergeSwaggerInjectedParameters(path, method);
        }
      });
    });
    return this.apiObject;
  }

  /**
   * Injects param/definition paths
   * @param {string} path - Path of api
   * @param {string} method - Method of path to x inject to
   */
  public xRequestInjector (path: string, method: string) {
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
      headers: {
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
   * @param path
   * @param method
   */
  public mergeSwaggerInjectedParameters (path: string, method: string) {
    Object.keys(this.apiObject.paths[path][method]['x-request-definitions']).forEach((requestType) => {
      const requestObject: any = {};
      let clear = true;
      this.apiObject.paths[path][method]['x-request-definitions'][requestType].params.forEach((requestPath: any) => {
        const parameterObject = _.get(this.apiObject, requestPath);
        clear = false;
        if (requestType === 'body') {
          // make object from body
        } else {
          let name = parameterObject.name;
          name += (!parameterObject.required) ? '?' : '';
          if (this.isSwagger()) {
            requestObject[name] = openApiTypeToTypscriptType(parameterObject.type);
          } else if (this.isOpenAPI3()) {
            requestObject[name] = openApiTypeToTypscriptType(parameterObject.schema.type);
          }
        }
      });
      if (!clear) {
        const name = this.apiObject.paths[path][method]['x-request-definitions'][requestType].name;
        this.apiObject.paths[path][method]['x-request-definitions'][requestType].interfaceText = {
          outputString: this.objectToInterfaceString(requestObject, name),
        };
      } else {
        delete this.apiObject.paths[path][method]['x-request-definitions'][requestType];
      }
    });
  }

  /**
   * Convert interface object to string
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
    if (this.isOpenAPI3()) {
      return this.injectFromOA3Response(path, method);
    }
    if (this.isSwagger()) {
      return this.injectFromOA2Response(path, method);
    }
  }

  public injectFromOA2Response (path: string, method: string): { '200': any } | {} {
    const response: any = {};
    const pathResponses = this.apiObject.paths[path][method].responses || false;
    if (pathResponses && pathResponses['200'] && pathResponses['200'].schema && pathResponses['200'].schema.$ref) {
      try {
        const responseInterface = this.convertRefToOjectPath(pathResponses['200'].schema.$ref).split('.').pop();
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
