const swaggerDefinitionToTypescriptInterface = (definition, definitionName, curlyBrace = true, semiColon = true, requiredParam = false) => {
  if (definition.type === 'object' && !definition.properties) {
    return ''
  }
  if (definition.type === 'integer') {
    definition.type = 'number'
  }
  let itemInterface
  let text = definitionName ? definitionName + ((requiredParam) ? '': '?') + ': ' : ''

  switch(definition.type) {
    case 'object':
      text += curlyBrace ? '{' : ''
      Object.keys(definition.properties).forEach((propertyName) => {
        text += swaggerDefinitionToTypescriptInterface(
          definition.properties[propertyName],
          propertyName,
          true,
          true,
          (definition.required && definition.required.indexOf(propertyName) !== -1)
        )
      })
      text += curlyBrace ? '}' : ''
      break
    case 'array':
      itemInterface = swaggerDefinitionToTypescriptInterface(definition.items, null, false, false)
      if (definition.items.type === 'object') {
        text += `{${itemInterface}}[]`
      } else {
        text += `${itemInterface}[]`
      }
      break
    case 'array-interface':
      itemInterface = swaggerDefinitionToTypescriptInterface(definition.items, null, false, false)
      text += '[index: number]: '
      if (definition.items.type === 'object') {
        text += `{${itemInterface}}`
      } else {
        text += itemInterface
      }
      break
    default:
      text += definition.type
  }

  text = semiColon && text.trim().length > 0 ? `${text};` : text
  text = text.replace(';;', ';')
  return text
}
module.exports = swaggerDefinitionToTypescriptInterface
