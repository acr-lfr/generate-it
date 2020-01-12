import ucFirst from '@/lib/template/helpers/ucFirst';

function addType (withType: boolean, pathObject: any, requestType?: string, forceType?: string, forceTypeOptional?: boolean) {
  if (!withType) {
    return '';
  }
  if (!forceType && requestType && pathObject['x-request-definitions'] && pathObject['x-request-definitions'][requestType]) {
    if (requestType === 'body') {
      return ': ' + ucFirst(pathObject['x-request-definitions'][requestType].params[0].name);
    }
    return ': ' + pathObject['x-request-definitions'][requestType].name;
  }
  return ': ' + ((forceType) ? forceType + (forceTypeOptional ? ' | undefined' : '') : 'any');
}

/**
 * Provides parameters for controller and domain functions.
 * Will auto inject the req.jwtData if the path has a security attribute.
 * @param pathObject The full value of the path object
 * @param {boolean | object} withType If true will inject the typescript type any
 * @param {boolean} withPrefix
 * @param pathNameChange
 * @returns {string}
 */
export default function (pathObject: any, withType: boolean = false, withPrefix?: string, pathNameChange: string = 'path') {
  if (!pathObject) {
    return '';
  }
  let params: string[] = [];
  if (pathObject.parameters) {
    if (pathObject.parameters.some((p: any) => p.in === 'query')) {
      params.push('query' + addType(withType, pathObject, 'query'));
    }
    if (pathObject.parameters.some((p: any) => p.in === 'path')) {
      params.push(pathNameChange + addType(withType, pathObject, 'path'));
    }
    if (pathObject.parameters.some((p: any) => p.in === 'body')) {
      params.push('body' + addType(withType, pathObject, 'body'));
    }
    if (pathObject.parameters.some((p: any) => p.in === 'headers')) {
      params.push('headers' + addType(withType, pathObject, 'headers'));
    }
    if (pathObject.parameters.some((p: any) => p.in === 'formData')) {
      params.push('files' + addType(withType, pathObject, 'formData'));
    }
  }
  const helpers = (this.ctx && this.ctx.config.data.nodegenRc.helpers) ? this.ctx.config.data.nodegenRc.helpers : undefined;
  const fileType = (this.ctx && this.ctx.fileType) ? this.ctx.fileType : undefined;
  const stubHelpers = (helpers && helpers.stub) ? helpers.stub : undefined;
  if (pathObject.security) {
    let push = false;
    pathObject.security = pathObject.security || [];
    pathObject.security.forEach((security: any) => {
      Object.keys(security).forEach((key) => {
        if (key.toLowerCase().includes('jwt')) {
          push = true;
        }
      });
    });
    if (push || pathObject['x-passThruWithoutJWT']) {
      if (fileType === 'STUB') {
        params.push(
          'jwtData' + addType(
          withType,
          pathObject,
          undefined,
          (stubHelpers && stubHelpers.jwtType) ? stubHelpers.jwtType : undefined,
          (!!pathObject['x-passThruWithoutJWT']),
        ));
      } else {
        params.push('jwtData' + addType(withType, pathObject));
      }
    }
  }
  if (pathObject['x-passRequest']) {
    if (fileType === 'STUB') {
      params.push(
        'req' + addType(
        withType,
        pathObject,
        undefined,
        (stubHelpers && stubHelpers.requestType) ? stubHelpers.requestType : undefined,
      ));
    } else {
      params.push('req' + addType(withType, pathObject));
    }
  }
  params.sort();
  if (withPrefix) {
    params = params.map((p: string) => (p === 'req') ? 'req' : 'req.' + p);
  }
  return params.join(', ') + ((withType && params.length > 0) ? ',' : '');
}
