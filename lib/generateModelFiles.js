const prettier = require('prettier')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const namingUtils = require('./helpers/namingUtils')
const generateSwaggerDefinitionToTypescriptInterface = require('./generateSwaggerDefinitionToTypescriptInterface')
const TemplateRenderer = require('./TemplateRenderer')

/**
 * Generates all the files for each operation by iterating over the operations.
 *
 * @param   {Object}  config Configuration options
 * @returns {Promise}
 */
module.exports = (config) => new Promise((resolve, reject) => {
  _.each(config.data.swagger.definitions, (definitionObject, definitionName) => {
    const filePath = path.join(config.root, config.file_name)
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err)
      }
      const subdir = config.root.replace(new RegExp(`${config.templates_dir}[/]?`), '')
      const ext = namingUtils.getFileExt(config.file_name)
      const newFilename = definitionName + ext
      const targetFile = path.resolve(config.target_dir, subdir, newFilename)

      if (definitionObject.type === 'array') {
        definitionObject.type = 'array-interface'
      }
      let content = TemplateRenderer.load(data.toString(), {
        definitionName,
        definitionObject,
        definitionProperties: definitionObject.properties || {},
        definitionInterfaceText: generateSwaggerDefinitionToTypescriptInterface(definitionObject, null, false),
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
      if (config.data.ignoredModules && config.data.ignoredModules.includes(moduleType) && fs.existsSync(targetFile)) {
        return reject('file exists')
      }
      fs.writeFile(targetFile, content, 'utf8', (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
})
