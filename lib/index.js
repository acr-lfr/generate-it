const pause = require('./pause')
const progressBar = require('progress')
const configMerger = require('./configMerger')
const generateDirectoryStructure = require('./generateDirectoryStructure')
const OpenApiToObject = require('./OpenApiToObject')
const TemplateFetch = require('./TemplateFetch')
const FileIterator = require('./FileIterator')
const GeneratedComparison = require('./GeneratedComparison')

let timerComplete = false
const timer = () => {
  let bar = new progressBar(':bar', { total: 10 })
  let timer = setInterval(function () {
    bar.tick()
    if (timerComplete) {
      clearInterval(timer)
    }
  }, 100)
}

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
  timer()
  try {
    const templatesDir = await TemplateFetch.resolveTemplateType(config.template)
    let extendedConfig = await configMerger.base(config, templatesDir)
    const apiObject = await (new OpenApiToObject(extendedConfig)).build()
    extendedConfig = configMerger.injectSwagger(extendedConfig, apiObject)
    await FileIterator.walk(generateDirectoryStructure(extendedConfig, templatesDir), extendedConfig)
    timerComplete = true
  } catch (e) {
    timerComplete = true
    throw e
  }
  await pause(200)
  console.log(`
  
  `)
  console.log('Files for server/client generated, building stub file diff comparison..')
  console.log(`
  
  `)
  const diffObject = await GeneratedComparison.fileDiffs(config.targetDir)
  await GeneratedComparison.fileDiffsPrint(config.targetDir, diffObject)
  GeneratedComparison.versionCleanup(config.targetDir)
}
