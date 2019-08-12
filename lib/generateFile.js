const fs = require('fs-extra')
const path = require('path')
const TemplateRenderer = require('./TemplateRenderer')
const namingUtils = require('./helpers/namingUtils')
const _ = require('lodash')
/**
 * Generates a file.
 *
 * @private
 * @param  {Object} config
 * @param  {String} config.templates_dir Directory where the templates live.
 * @param  {String} config.target_dir    Directory where the file will be generated.
 * @param  {String} config.file_name     Name of the generated file.
 * @param  {String} config.root          Root directory.
 * @param  {Object} config.data          Data to pass to the template.
 * @param  {Boolean} IS_FIRST_RUN
 * @return {Promise}
 */
module.exports = (config, IS_FIRST_RUN) => new Promise((resolve, reject) => {
  const templates_dir = config.templates_dir
  const target_dir = config.target_dir
  const file_name = config.file_name
  const root = config.root
  // const data = config.data
  const loadFilePath = (file_name !== 'package.json.njk') ? path.resolve(root, file_name) : path.resolve(process.cwd(), 'package.json')

  const template_path = path.resolve(target_dir, path.relative(templates_dir, path.resolve(root, file_name)))
  if (IS_FIRST_RUN || !fs.existsSync(template_path) || root.includes('/http/nodegen')) {
    fs.readFile(loadFilePath, 'utf8', (err, content) => {
      if (err) return reject(err)
      try {
        let endpoints = []
        if (file_name.startsWith('routesImporter')) {
          _.each(config.data.swagger.paths, (operation_path, path_name) => {
            let operation_name
            const segments = path_name.split('/').filter(s => s && s.trim() !== '')
            if (segments.length > config.segmentsCount) {
              segments.splice(config.segmentsCount)
              operation_name = segments.join(' ').toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
            } else {
              operation_name = operation_path.endpointName
            }
            !endpoints.includes(operation_name) && endpoints.push(operation_name);
          })
        }
        const template = TemplateRenderer.load(content, {
          package: config.package,
          swagger: config.data.swagger,
          definitions: Object.keys(config.data.swagger.definitions),
          endpoints,
        })
        const parsed_content = template.replace(new RegExp('&' + '#' + 'x27;', 'g'), '\'')
        const template_path = path.relative(templates_dir, path.resolve(root, namingUtils.stripNjkExtension(file_name)))
        const generated_path = path.resolve(target_dir, template_path)
        fs.writeFile(generated_path, parsed_content, 'utf8', (err) => {
          if (err) return reject(err)
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
