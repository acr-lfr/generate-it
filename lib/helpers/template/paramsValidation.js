const swaggerUtils = require('../swaggerUtils')
module.exports = (params) => {
  if (!params) return
  const paramsTypes = {
    body: params.filter(param => param.in === 'body'),
    params: params.filter(param => param.in === 'path'),
    query: params.filter(param => param.in === 'query'),
  }

  let validationText = ''

  Object.keys(paramsTypes).forEach((paramTypeKey) => {
    if (paramsTypes[paramTypeKey].length === 0) return
    validationText += paramTypeKey + ': {'
    paramsTypes[paramTypeKey].forEach(param => {
      if (param.schema && param.schema.properties) {
        Object.keys(param.schema.properties).forEach((propertyKey) => {
          validationText += swaggerUtils.pathParamsToJoi({ name: propertyKey, ...param.schema.properties[propertyKey] }, { requiredFields: param.schema.required })
        })
      } else if (param.type) {
        validationText += swaggerUtils.pathParamsToJoi(param)
      }
    })
    validationText += '},'
  })

  return validationText

}
