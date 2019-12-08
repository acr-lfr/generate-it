import * as _ from 'lodash';

/**
 * Generates an "operationId" attribute based on path and method names  <path><method>
 *
 * @private
 * @param  {String} methodName HTTP method name.
 * @param  {String} pathName   Path name.
 * @return {String}
 */
export default (methodName: string, pathName: string) => {
  methodName = _.camelCase(methodName);
  if (pathName === '/') {
    return methodName;
  }
  const filePathParts = pathName.split('/');
  filePathParts.forEach((part: string, i: number) => {
    if (part[0] === '{') {
      part = part.slice(1, part.length - 1);
    }
    filePathParts[i] = _.upperFirst(part);
  });
  filePathParts.push(_.upperFirst(methodName));
  return _.camelCase(filePathParts.join(''));
};
