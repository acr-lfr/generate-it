function addAnyType(withType, optionalParam){
  if(!withType){
    return ''
  }
  const returnString = ': any'
  return (optionalParam) ? '?' + returnString: returnString
}
/**
 * Provides parameters for controller and domain functions.
 * Will auto inject the req.jwtData if the path has a security attribute.
 * @param value The full value of the path object
 * @param {boolean} withType If true will inject the typescript type any
 * @param {boolean} withPrefix
 * @param optionalParam
 * @returns {string}
 */
module.exports = (value, withType = false, withPrefix = false, optionalParam = false) => {
  if (!value) return ''
  let params = []
  if (value.parameters) {
    if (value.parameters.some(p => p.in === 'query')) params.push('query' + addAnyType(withType, optionalParam))
    if (value.parameters.some(p => p.in === 'path')) params.push('params' + addAnyType(withType, optionalParam))
    if (value.parameters.some(p => p.in === 'body')) params.push('body' + addAnyType(withType, optionalParam))
    if (value.parameters.some(p => p.in === 'formData')) params.push('files' + addAnyType(withType, optionalParam))
  }
  if (value.security) {
    params.push('jwtData' + addAnyType(withType, optionalParam))
  }
  if (withPrefix) {
    params = params.map(p => 'req.' + p)
  }
  if (value['passRequest'] || value['x-passRequest']) {
    params.push('req' + addAnyType(withType, optionalParam))
  }
  return params.join(', ')
}
