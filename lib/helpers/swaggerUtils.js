/**
@param options - options.isFromArray [string], options.requiredField [string[]]
**/
function pathParamsToJoi(param, options = {}) {
  if (!param) {
    console.log(param, options)
    return;
  }
  let validationText = param.name ? param.name + ':' : ''
  const isRequired = (options.requiredFields && options.requiredFields.includes(param.name)) || param.required
  if (['string', 'number', 'boolean'].includes(param.type)) {
    validationText += 'Joi.' + param.type + '()'
    if (param.type === 'string') validationText += `.allow('')`
    if (param.default) {
      if (param.type === 'string') validationText += `.default('${param.default}')`
      else validationText += `.default(${param.default})`
    }
    if (param.enum) {
      validationText += '.valid([' + param.enum.map(e => `'${e}'`).join(', ') + '])'
    }
    validationText += (isRequired ? '.required()' : '') + (!options.isFromArray ? ',' : '')
  } else if (param.type === 'array') {
    validationText += 'Joi.array().items('
    validationText += pathParamsToJoi(param.schema ? param.schema.items : param.items, { isFromArray: true })
    validationText += '),'
  } else if (param.properties || param.schema) {
    const properties = param.properties || param.schema.properties || {}
    validationText += 'Joi.object({'
    Object.keys(properties).forEach((propertyKey) => {
      validationText += pathParamsToJoi({ name: propertyKey, ...properties[propertyKey] })
    })
    validationText += '})' + (isRequired ? '.required()' : '') + (!options.isFromArray ? ',' : '')
  } else {
    validationText += 'Joi.any()' + (isRequired ? '.required()' : '') + (!options.isFromArray ? ',' : '')
  }
  return validationText
}

module.exports = {
  pathParamsToJoi,
}
