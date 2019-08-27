const fs = require('fs-extra')
const path = require('path')
const TemplateRenderer = require('./TemplateRenderer')
const namingUtils = require('./helpers/NamingUtils')
const _ = require('lodash')
/**
 * Generates a file.
 *
 * @private
 * @param  {Object} config
 * @param  {String} config.templates_dir Directory where the templates live.
 * @param  {String} config.targetDir    Directory where the file will be generated.
 * @param  {String} config.file_name     Name of the generated file.
 * @param  {String} config.root          Root directory.
 * @param  {Object} config.data          Data to pass to the template.
 * @param  {Boolean} isFirstRun
 * @return {Promise}
 */
module.exports = (config, isFirstRun) => {
  return new Promise((resolve, reject) => {
    const templatesDir = config.templates_dir
    const targetDir = config.targetDir
    const fileName = config.file_name
    const root = config.root
    // const data = config.data
    const loadFilePath = (fileName !== 'package.json.njk') ? path.resolve(root, fileName) : path.resolve(process.cwd(), 'package.json')

    const templatePath = path.resolve(targetDir, path.relative(templatesDir, path.resolve(root, fileName)))
    if (isFirstRun || !fs.existsSync(templatePath) || root.includes('/http/nodegen')) {
      global.verboseLogging('Parsing/placing file: ' + templatePath)
      fs.readFile(loadFilePath, 'utf8', (err, content) => {
        if (err) {
          return reject(err)
        }
        try {
          let endpoints = []
          if (fileName.startsWith('routesImporter')) {
            _.each(config.data.swagger.paths, (operationPath, pathName) => {
              let operationName
              const segments = pathName.split('/').filter((s) => s && s.trim() !== '')
              if (segments.length > config.segmentsCount) {
                segments.splice(config.segmentsCount)
                operationName = segments.join(' ').toLowerCase().replace(/[^a-zA-Z0-9-]+(.)/g, (m, chr) => chr.toUpperCase())
              } else {
                operationName = operationPath.endpointName
              }
              !endpoints.includes(operationName) && endpoints.push(operationName)
            })
          }
          const template = TemplateRenderer.load(content, {
            package: config.package,
            swagger: config.data.swagger,
            definitions: Object.keys(config.data.swagger.definitions),
            endpoints,
          })
          const parsedContent = template.replace(new RegExp('&' + '#' + 'x27;', 'g'), '\'')
          const templatePath = path.relative(templatesDir, path.resolve(root, namingUtils.stripNjkExtension(fileName)))
          const generatedPath = path.resolve(targetDir, templatePath)
          fs.writeFile(generatedPath, parsedContent, 'utf8', (err) => {
            if (err) {
              return reject(err)
            }
            resolve()
          })
        } catch (e) {
          reject(e)
        }
      })
    } else {
      resolve()
    }
  })
}
