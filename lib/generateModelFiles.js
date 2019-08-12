const prettier = require('prettier')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const namingUtils = require('./helpers/namingUtils')
const TemplateRenderer = require('./TemplateRenderer')

/**
 * Generates all the files for each operation by iterating over the operations.
 *
 * @param   {Object}  config Configuration options
 * @returns {Promise}
 */
module.exports = config => new Promise((resolve, reject) => {
  _.each(config.data.swagger.definitions, (definitionObject, definitionName) => {
    const filePath = path.join(config.root, config.file_name)
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err)
      const subdir = config.root.replace(new RegExp(`${config.templates_dir}[/]?`), '')
      const ext = namingUtils.getFileExt(config.file_name)
      const new_filename = `${definitionName}.model.${ext}`
      const target_file = path.resolve(config.target_dir, subdir, new_filename)

      const swaggerDefinitionToTypescriptInterface = (definition, definitionName, curlyBrace = true, semiColon = true) => {
        if (definition.type === 'object' && !definition.properties) return ''
        if (definition.type === 'integer') definition.type = 'number'
        let text = definitionName ? `${definitionName}: ` : '';
        if (definition.type === 'object' && definition.properties) {
          text += curlyBrace ? '{' : ''
          Object.keys(definition.properties).forEach((propertyName) => {
            text += swaggerDefinitionToTypescriptInterface(definition.properties[propertyName], propertyName)
          })
          text += curlyBrace ? '}' : ''
        } else if (definition.type === 'array') {
          const itemInterface = swaggerDefinitionToTypescriptInterface(definition.items, null, false, false)
          if (definition.items.type === 'object') text += `{${itemInterface}}[]`
          else text += `${itemInterface}[]`
        } else if (definition.type === 'array-interface') {
          const itemInterface = swaggerDefinitionToTypescriptInterface(definition.items, null, false, false)
          text += '[index: number]: '
          if (definition.items.type === 'object') text += `{${itemInterface}}`
          else text += `${itemInterface}`
        } else {
          text += definition.type
        }

        text = semiColon && text.trim().length > 0 ? `${text};` : text
        text = text.replace(';;', ';')
        return text
      };

      if (definitionObject.type === 'array') definitionObject.type = 'array-interface'
      let content = TemplateRenderer.load(data.toString(), {
        definitionName,
        definitionObject,
        definitionProperties: definitionObject.properties || {},
        definitionInterfaceText: swaggerDefinitionToTypescriptInterface(definitionObject, null, false),
      })

      content = content.replace(new RegExp('&' + '#' + 'x27;', 'g'), '\'')
      content = prettier.format(content, {
        indent_size: 2,
        space_in_empty_paren: true,
        end_with_newline: true,
        semi: true,
        singleQuote: true,
        parser: ext === 'ts' ? 'typescript' : 'babel'
      })

      const moduleType = subdir.substring(subdir.lastIndexOf('/') + 1)
      if (config.data.ignoredModules && config.data.ignoredModules.includes(moduleType) && fs.existsSync(target_file)) {
        return reject('file exists')
      }
      fs.writeFile(target_file, content, 'utf8', (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  })
})
