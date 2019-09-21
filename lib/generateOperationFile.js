const prettier = require('prettier')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const namingUtils = require('./helpers/NamingUtils')
const TemplateRenderer = require('./TemplateRenderer')
const FileTypeCheck = require('./FileTypeCheck')
const GeneratedComparison = require('./GeneratedComparison')

/**
 * Generates a file for every operation.
 *
 * @param config
 * @param operation
 * @param operationName
 * @param verbose
 * @param additionalTplContent
 * @returns {Promise}
 */
module.exports = (config, operation, operationName, verbose = false, additionalTplContent = {}) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(config.root, config.file_name)
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err)
      }
      const subDir = config.root.replace(new RegExp(`${config.templates_dir}[/]?`), '')
      const ext = namingUtils.getFileExt(config.file_name)
      const newFilename = namingUtils.fixRouteName(namingUtils.generateOperationSuffix(subDir, operationName, ext))
      const targetFile = path.resolve(config.targetDir, subDir, newFilename)
      const tplVars = {
        operation_name: _.camelCase(operationName.replace(/[}{]/g, '')),
        operations: operation,
        swagger: config.data.swagger,
        securityDefinitions: config.securityDefinitions,
        mockServer: config.mockServer || false,
        verbose: verbose,
        ...additionalTplContent
      }
      let renderedContent = TemplateRenderer.load(data.toString(), tplVars)

      const replacedCharacters = renderedContent.replace(new RegExp('&' + '#' + 'x27;', 'g'), '\'')
      const prettyContent = prettier.format(replacedCharacters, {
        indent_size: 2,
        space_in_empty_paren: true,
        end_with_newline: true,
        semi: true,
        singleQuote: true,
        parser: ext === 'ts' ? 'typescript' : 'babel'
      })

      const moduleType = subDir.substring(subDir.lastIndexOf('/') + 1)
      if (config.data.ignoredModules && config.data.ignoredModules.includes(moduleType)) {
        return reject('Module ignored: ' + moduleType)
      }
      if (FileTypeCheck.isStubFile(config.file_name) && fs.existsSync(targetFile)) {
        GeneratedComparison.generateComparisonFile(
          targetFile,
          config.targetDir,
          subDir,
          newFilename,
          prettyContent
        )
          .then(resolve)
          .catch(reject)
      } else {
        fs.writeFileSync(targetFile, prettyContent, 'utf8')
        return resolve()
      }
    })
  })
}
