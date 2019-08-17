const swaggerDefinitionToTypescriptInterface = (definition, definitionName, curlyBrace = true, semiColon = true) => {
  if (definition.type === 'object' && !definition.properties) {
    return ''
  }
  if (definition.type === 'integer') {
    definition.type = 'number'
  }
  let text = definitionName ? `${definitionName}: ` : ''
  if (definition.type === 'object' && definition.properties) {
    text += curlyBrace ? '{' : ''
    Object.keys(definition.properties).forEach((propertyName) => {
      text += swaggerDefinitionToTypescriptInterface(definition.properties[propertyName], propertyName)
    })
    text += curlyBrace ? '}' : ''
  } else if (definition.type === 'array') {
    const itemInterface = swaggerDefinitionToTypescriptInterface(definition.items, null, false, false)
    if (definition.items.type === 'object') {
      text += `{${itemInterface}}[]`
    } else {
      text += `${itemInterface}[]`
    }
  } else if (definition.type === 'array-interface') {
    const itemInterface = swaggerDefinitionToTypescriptInterface(definition.items, null, false, false)
    text += '[index: number]: '
    if (definition.items.type === 'object') {
      text += `{${itemInterface}}`
    } else {
      text += itemInterface
    }
  } else {
    text += definition.type
  }

  text = semiColon && text.trim().length > 0 ? `${text};` : text
  text = text.replace(';;', ';')
  return text
}
module.exports = swaggerDefinitionToTypescriptInterface
