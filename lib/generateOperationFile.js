const beautify = require('js-beautify')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const namingUtils = require('./helpers/namingUtils')
const TemplateRenderer = require('./TemplateRenderer')

/**
 * Generates a file for every operation.
 *
 * @param config
 * @param operation
 * @param operation_name
 * @returns {Promise}
 */
module.exports = (config, operation, operation_name) => new Promise((resolve, reject) => {
  const filePath = path.join(config.root, config.file_name)
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return reject(err)
    const subdir = config.root.replace(new RegExp(`${config.templates_dir}[/]?`), '')
    const ext = namingUtils.getFileExt(config.file_name)
    const new_filename = namingUtils.fixRouteName(namingUtils.generateOperationSuffix(subdir, operation_name, ext))
    const target_file = path.resolve(config.target_dir, subdir, new_filename)

    if (subdir === 'src/domains' && fs.existsSync(target_file)) {
      resolve()
      return
    }
    console.log(filePath)
    let content = TemplateRenderer.load(data.toString(), {
      operation_name: _.camelCase(operation_name.replace(/[}{]/g, '')),
      operations: operation,
      swagger: config.data.swagger,
      securityDefinitions: config.securityDefinitions,
      mockServer: config.mockServer || false
    })

    content = content.replace(new RegExp('&' + '#' + 'x27;', 'g'), '\'')
    content = beautify(content, {
      indent_size: 2,
      space_in_empty_paren: true,
      end_with_newline: true,
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
