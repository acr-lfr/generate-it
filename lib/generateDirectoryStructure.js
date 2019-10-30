require('colors')
const generateBaseStructure = require('./generateBaseStructure')
const resetNodegenFolder = require('./resetNodegenFolder')
const fs = require('fs-extra')
const path = require('path')
const displayDependencyDiffs = require('./displayDependencyDiffs')

/**
 * Generates the directory structure.
 * @param  {Object}        config - Configuration options
 * @param  {Object|String} config.swagger - Swagger JSON or a string pointing to a Swagger file.
 * @param  {String}        config.targetDir - Absolute path to the directory where the files will be generated.
 * @param  {String}        config.templates - Absolute path to the templates that should be used.
 * @param  {Object}        config.nodegenRc - Absolute path to the templates that should be used.
 * @param  {String}        templatesDir - The absolute path the templates directory
 * @return {boolean}
 */
module.exports = (config, templatesDir) => {
  const targetDir = config.targetDir
  let IS_FIRST_RUN = false
  if (!fs.existsSync(path.join(targetDir, config.nodegenRc.nodegenDir))) {
    IS_FIRST_RUN = true
    generateBaseStructure(
      targetDir,
      templatesDir,
      (config.mockServer) ? { mockingServer: true } : {})
  } else {
    resetNodegenFolder(targetDir, templatesDir, config.mockServer, config.nodegenRc)
    displayDependencyDiffs(targetDir, templatesDir)
  }
  return IS_FIRST_RUN
}
