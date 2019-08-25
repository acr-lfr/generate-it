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
    generateBaseStructure(targetDir, templatesDir, (config.mockServer) ? {
      mockingServer: true
    } : {})
  } else {
    resetNodegenFolder(targetDir, templatesDir, config.mockServer)
  }
  return IS_FIRST_RUN
}
