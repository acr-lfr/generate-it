require('colors')
const generateBaseStructure = require('./generateBaseStructure')
const resetNodegenFolder = require('./resetNodegenFolder')
const fs = require('fs-extra')
const path = require('path')

/**
 * Generates the directory structure.
 *
 * @private
 * @param  {Object}        config Configuration options
 * @param  {Object|String} config.swagger Swagger JSON or a string pointing to a Swagger file.
 * @param  {String}        config.targetDir Absolute path to the directory where the files will be generated.
 * @param  {String}        config.templates Absolute path to the templates that should be used.
 * @return {boolean}
 */
module.exports = (config) => {
  const targetDir = config.targetDir
  const templatesDir = config.templates
  let IS_FIRST_RUN = false
  if (!fs.existsSync(path.join(targetDir, 'src'))) {
    IS_FIRST_RUN = true
    console.log('Generating base structure as no "src" folder found.'.green)
    generateBaseStructure(targetDir, templatesDir, (config.mockServer) ? {
      mockingServer: true
    } : {})
  } else {
    console.log('Base structure structure found "src", resetting nodegen contents.'.green)
    resetNodegenFolder(targetDir, templatesDir, config.mockServer)
    console.log('Nodegen dir reset.'.green)
  }
  return IS_FIRST_RUN
}
