require('colors')
const configMerger = require('./configMerger')
const generateDirectoryStructure = require('./generateDirectoryStructure')
const OpenApiToObject = require('./OpenApiToObject')
const TemplateFetch = require('./TemplateFetch')
const FileIterator = require('./FileIterator')
const GeneratedComparison = require('./GeneratedComparison')

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
  console.log('Preparing templates...'.green.bold)
  const templatesDir = await TemplateFetch.resolveTemplateType(config.template)
  let extendedConfig = await configMerger.base(config, templatesDir)
  console.log('Preparing openapi object...'.green.bold)
  const apiObject = await (new OpenApiToObject(extendedConfig)).build()
  extendedConfig = configMerger.injectSwagger(extendedConfig, apiObject)
  console.log('Injecting content to files...'.green.bold)
  await FileIterator.walk(generateDirectoryStructure(extendedConfig, templatesDir), extendedConfig)
  console.log('Building stub file comparison list...'.green.bold)
  const diffObject = await GeneratedComparison.fileDiffs(config.targetDir)
  await GeneratedComparison.fileDiffsPrint(config.targetDir, diffObject)
  console.log('Comparison version cleanup...'.green.bold)
  GeneratedComparison.versionCleanup(config.targetDir)
}
