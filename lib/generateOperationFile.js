const prettier = require('prettier')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const namingUtils = require('./helpers/NamingUtils')
const TemplateRenderer = require('./TemplateRenderer')

/**
 * Generates a file for every operation.
 *
 * @param config
 * @param operation
 * @param operationName
 * @returns {Promise}
 */
module.exports = (config, operation, operationName) => new Promise((resolve, reject) => {
  const filePath = path.join(config.root, config.file_name)
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return reject(err)
    }
    const subdir = config.root.replace(new RegExp(`${config.templates_dir}[/]?`), '')
    const ext = namingUtils.getFileExt(config.file_name)
    const newFilename = namingUtils.fixRouteName(namingUtils.generateOperationSuffix(subdir, operationName, ext))
    const targetFile = path.resolve(config.target_dir, subdir, newFilename)

    if (subdir === 'src/domains' && fs.existsSync(targetFile)) {
      resolve()
      return
    }
    let content = TemplateRenderer.load(data.toString(), {
      operation_name: _.camelCase(operationName.replace(/[}{]/g, '')),
      operations: operation,
      swagger: config.data.swagger,
      securityDefinitions: config.securityDefinitions,
      mockServer: config.mockServer || false
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
