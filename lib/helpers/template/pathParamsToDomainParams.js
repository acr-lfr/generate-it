function addType (withType, pathObject, requestType) {
  if (!withType) {
    return ''
  }
  if (pathObject['x-request-definitions'] && pathObject['x-request-definitions'][requestType]) {
    return ': ' + pathObject['x-request-definitions'][requestType].name
  }
  return ': any'
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
module.exports = (value, withType = false, withPrefix = false, pathNameChange = 'path') => {
  if (!value) {
    return ''
  }
  let params = []
  if (value.parameters) {
    if (value.parameters.some((p) => p.in === 'query')) {
      params.push('query' + addType(withType, value, 'query'))
    }
    if (value.parameters.some((p) => p.in === 'path')) {
      params.push(pathNameChange + addType(withType, value, 'path'))
    }
    if (value.parameters.some((p) => p.in === 'body')) {
      params.push('body' + addType(withType, value, 'body'))
    }
    if (value.parameters.some((p) => p.in === 'headers')) {
      params.push('headers' + addType(withType, value, 'headers'))
    }
    if (value.parameters.some((p) => p.in === 'formData')) {
      params.push('files' + addType(withType, value, 'formData'))
    }
  }
  if (value.security) {
    params.push('jwtData' + addType(withType, value))
  }
  if (withPrefix) {
    params = params.map((p) => 'req.' + p)
  }
  if (value['passRequest'] || value['x-passRequest']) {
    params.push('req' + addType(withType, value))
  }
  params.sort()
  return params.join(', ') + ((withType && params.length > 0) ? ',' : '')
}
