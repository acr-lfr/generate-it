const os = require('os')
const path = require('path')
const _ = require('lodash')
const openApiToObject = require('./openApiToObject')
const generateDirectoryStructure = require('./generateDirectoryStructure')
const TemplateFetch = require('./TemplateFetch')

/**
 * Generates a code skeleton for an API given an OpenAPI/Swagger file.
 *
 * @module codegen.generate
 * @param  {Object} config Configuration options
 * @param  {String} config.swaggerFilePath - OpenAPI file path
 * @param  {String} config.target_dir Path to the directory where the files will be generated.
 * @param  {String} config.template - Templates to use, es6 or typescript
 * @param  {String} config.handlebars_helper - Additional custom helper files to loads
 * @param  {Boolean} config.mockServer - Dictates if mocker server is generated or not, this overwrites all files in target
 * @param  {Boolean} config.verbose - Verbose logging on or off
 * @return {Promise}
 */
module.exports = (config) => new Promise((resolve, reject) => {
  openApiToObject(config.swaggerFilePath).then((swagger) => {
    const randomName = require('project-name-generator')().dashed
    TemplateFetch.resolveTemplateType(config.template)
      .then((templates) => {
        config.swagger = swagger
        _.defaultsDeep(config, {
          swagger: {
            info: {
              title: randomName
            }
          },
          package: {
            name: _.kebabCase(_.result(config, 'swagger.info.title', randomName))
          },
          target_dir: path.resolve(os.tmpdir(), 'swagger-node-generated-code'),
          templates: templates,
          ignoredModules: config.ignoredModules,
          segmentsCount: config.segmentsCount,
          mockServer: config.mockServer || false,
        })
        generateDirectoryStructure(config).then(resolve).catch(reject)
      })
      .catch(reject)
  }).catch(reject)
})
