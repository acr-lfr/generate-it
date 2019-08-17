const _ = require('lodash')

/**
 * Generates an "operationId" attribute based on path and method names  <path><method>
 *
 * @private
 * @param  {String} methodName HTTP method name.
 * @param  {String} pathName   Path name.
 * @return {String}
 */
module.exports = (methodName, pathName) => {
  methodName = _.camelCase(methodName)
  if (pathName === '/') {
    return methodName
  }
  let filePathParts = pathName.split('/')
  filePathParts.forEach((part, i) => {
    if (part[0] === '{') {
      part = part.slice(1, part.length - 1)
    }
    filePathParts[i] = _.upperFirst(part)
  })
  filePathParts.push(_.upperFirst(methodName))
  return _.camelCase(filePathParts.join(''))
}
