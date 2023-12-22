import ucFirst from '@/lib/template/helpers/ucFirst';
import oa3toOa2Body from '@/lib/openapi/oa3toOa2Body';

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
 * @param method
 * @param pathObject The full value of the path object
 * @param {boolean | object} withType If true will inject the typescript type any
 * @param {boolean} withPrefix
 * @param pathNameChange - Defaults to "pathParams" so as not to collide with the node path lib
 * @returns {string}
 */
export default function (method: string, pathObject: any, withType: boolean = false, withPrefix?: string, pathNameChange: string = 'pathParams') {
  if (!pathObject) {
    return '';
  }
  // for OA3 only this is expected where the body cannot be in the parameters
  pathObject = oa3toOa2Body(method, pathObject);

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
    if (pathObject.parameters.some((p: any) => p.in === 'header')) {
      params.push('headers' + addType(withType, pathObject, 'header'));
    }
    if (pathObject.parameters.some((p: any) => p.in === 'formData')) {
      params.push('formData' + addType(withType, pathObject, 'formData'));
    }
  }

  const helpers = this?.ctx?.config?.data?.nodegenRc?.helpers;
  const tplType = this?.ctx?.config?.data?.nodegenRc?.nodegenType;
  const fileType = this?.ctx?.fileType;
  const stubHelpers = (helpers && helpers.stub) ? helpers.stub : undefined;
  if (pathObject.security && tplType !== 'client') {
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
      params.push(
        'jwtData' + addType(
          withType,
          pathObject,
          undefined,
          (stubHelpers && stubHelpers.jwtType) ? stubHelpers.jwtType : undefined,
          (!!pathObject['x-passThruWithoutJWT']),
        ));
    }
  }

  // Inject the request to the params
  if (pathObject['x-passRequest'] && tplType !== 'client') {
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

  // Inject the response to the params
  if (pathObject['x-passResponse'] && tplType !== 'client') {
    const type = withType ? ': Response' : '';
    params.push(`res${type}`);
  }

  // sort the params object for uniform domain params!
  params.sort();

  // Inject any required prefix
  if (withPrefix) {
    params = params.map((p: string) => {
      if (p === 'req') {
        return 'req';
      }
      if (p === 'res') {
        return 'res';
      }
      return 'req.' + (p === 'formData' ? 'body' : p);
    });
  }
  return params.join(', ') + ((withType && params.length > 0) ? ',' : '');
}
