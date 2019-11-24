import Config from '@/interfaces/Config';

import * as _ from 'lodash';
import wrap from 'word-wrap';

import ValidHttpMethods from '@/constants/ValidHttpMethods';
import generateOperationId from '@/lib/generateOperationId';
import OpenAPIBundler from '@/lib/OpenAPIBundler';

export default class OpenApiToObject {
  public apiFile: string;
  public config: Config;

  /**
   * @param  {Object} config File path to Swagger file or **fully bundled and dereferenced** Swagger JS object.
   */
  constructor (config: Config) {
    this.apiFile = config.swaggerFilePath;
    this.config = config;
  }

  public async build () {
    if (typeof this.apiFile === 'string') {
      return this.iterateObject(await OpenAPIBundler.bundle(this.apiFile, this.config));
    } else if (typeof this.apiFile !== 'object') {
      throw new Error(`Could not find a valid swagger definition: ${this.apiFile}`);
    } else {
      return this.iterateObject(this.apiFile);
    }
  }

  public iterateObject (apiObject: any) {
    apiObject.basePath = apiObject.basePath || '';
    _.each(apiObject.paths, (path: any, pathName: string) => {
      path.endpointName = pathName === '/' ? 'root' : pathName.split('/')[1];
      _.each(path, (method: any, methodName: string) => {
        if (ValidHttpMethods.indexOf(methodName.toUpperCase()) === -1) {
          return;
        }
        method.operationId = _.camelCase(method.operationId || generateOperationId(methodName, pathName).replace(/\s/g, '-'));
        method.descriptionLines = wrap(method.description || method.summary || '', {
          width: 60, indent: '',
        }).split(/\n/);
        _.each(method.parameters, (param: any) => {
          param.type = param.type || (param.schema ? param.schema.type : undefined);
        });
      });
    });

    apiObject.endpoints = _.uniq(_.map(apiObject.paths, 'endpointName'));
    return apiObject;
  }
}
