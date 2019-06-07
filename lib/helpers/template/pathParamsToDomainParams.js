/**
 * Provides parameters for controller and domain functions.
 * Will auto inject the req.jwtData if the path has a security attribute.
 * @param value The full value of the path object
 * @param {boolean} withType If true will inject the typescript type any
 * @param {boolean} withPrefix
 * @returns {string}
 */
module.exports = (value, withType = false, withPrefix = false) => {
  if (!value) return ''
  let params = []
  if (value.parameters) {
    if (value.parameters.some(p => p.in === 'query')) params.push('query' + (withType ? ': any' : ''))
    if (value.parameters.some(p => p.in === 'path')) params.push('params' + (withType ? ': any' : ''))
    if (value.parameters.some(p => p.in === 'body')) params.push('body' + (withType ? ': any' : ''))
    if (value.parameters.some(p => p.in === 'formData')) params.push('files' + (withType ? ': any' : ''))
  }
  if (value.security) {
    params.push('jwtData')
  }
  if (withPrefix) {
    params = params.map(p => 'req.' + p)
  }
  if (value['passRequest'] || value['x-passRequest']) {
    params.push('req')
  }
  return params.join(', ')
}
