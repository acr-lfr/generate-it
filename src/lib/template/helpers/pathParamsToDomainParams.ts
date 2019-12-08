function addType (withType: boolean, pathObject: any, requestType?: string) {
  if (!withType) {
    return '';
  }
  if (requestType && pathObject['x-request-definitions'] && pathObject['x-request-definitions'][requestType]) {
    return ': ' + pathObject['x-request-definitions'][requestType].name;
  }
  return ': any';
}

/**
 * Provides parameters for controller and domain functions.
 * Will auto inject the req.jwtData if the path has a security attribute.
 * @param value The full value of the path object
 * @param {boolean | object} withType If true will inject the typescript type any
 * @param {boolean} withPrefix
 * @param pathNameChange
 * @returns {string}
 */
export default (value: any, withType: boolean = false, withPrefix?: string, pathNameChange: string = 'path') => {
  if (!value) {
    return '';
  }
  let params: string[] = [];
  if (value.parameters) {
    if (value.parameters.some((p: any) => p.in === 'query')) {
      params.push('query' + addType(withType, value, 'query'));
    }
    if (value.parameters.some((p: any) => p.in === 'path')) {
      params.push(pathNameChange + addType(withType, value, 'path'));
    }
    if (value.parameters.some((p: any) => p.in === 'body')) {
      params.push('body' + addType(withType, value, 'body'));
    }
    if (value.parameters.some((p: any) => p.in === 'headers')) {
      params.push('headers' + addType(withType, value, 'headers'));
    }
    if (value.parameters.some((p: any) => p.in === 'formData')) {
      params.push('files' + addType(withType, value, 'formData'));
    }
  }
  if (value.security) {
    let push = false;
    value.security.forEach((security: any) => {
      Object.keys(security).forEach((key) => {
        if (key.toLowerCase().includes('jwt')) {
          push = true;
        }
      });
    });
    if (push) {
      params.push('jwtData' + addType(withType, value));
    }
  }
  if (value['x-passRequest']) {
    params.push('req' + addType(withType, value));
  }
  params.sort();
  if (withPrefix) {
    params = params.map((p: string) => (p === 'req') ? 'req' : 'req.' + p);
  }
  return params.join(', ') + ((withType && params.length > 0) ? ',' : '');
};
