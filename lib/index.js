const configMerger = require('./configMerger')
const generateDirectoryStructure = require('./generateDirectoryStructure')
const OpenApiToObject = require('./OpenApiToObject')
const TemplateFetch = require('./TemplateFetch')
const FileIterator = require('./FileIterator')

/**
 * Generates a code skeleton for an API given an OpenAPI/Swagger file.
 *
 * @module codegen.generate
 * @param  {Object} config Configuration options
 * @param  {String} config.swaggerFilePath - OpenAPI file path
 * @param  {String} config.targetDir Path to the directory where the files will be generated.
 * @param  {String} config.template - Templates to use, es6 or typescript
 * @param  {String} config.handlebars_helper - Additional custom helper files to loads
 * @param  {Boolean} config.mockServer - Dictates if mocker server is generated or not, this overwrites all files in target
 * @param  {Boolean} config.verbose - Verbose logging on or off
 * @return {Promise}
 */
module.exports = async (config) => {
  const apiObject = await (new OpenApiToObject(config.swaggerFilePath)).build()
  const templates = await TemplateFetch.resolveTemplateType(config.template)
  const extendedConfig = await configMerger(config, apiObject, templates)
  await FileIterator.walk(generateDirectoryStructure(extendedConfig), extendedConfig)
}
