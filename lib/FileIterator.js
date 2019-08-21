const fs = require('fs-extra')
const GenerateInterfaceFiles = require('./GenerateInterfaceFiles')
const generateOperationFiles = require('./generateOperationFiles')
const generateFile = require('./generateFile')
const path = require('path')
const walk = require('walk')
let config = {}
let isFirstRun
class FileWalker {
  /**
   * Walks over the file system compiling tpl files with the config data
   * @param {boolean} providedIsFirstRun
   * @param {object} providedConfig
   * @return {Promise<>}
   */
  walk (providedIsFirstRun, providedConfig) {
    config = providedConfig
    isFirstRun = providedIsFirstRun
    const targetDir = config.targetDir
    const templatesDir = config.templates
    fs.copySync(config.swaggerFilePath, path.resolve(targetDir, 'dredd', 'swagger.yml'))
    return new Promise((resolve, reject) => {
      walk.walk(templatesDir, {
        followLinks: false
      }).on('file', this.fileIteration)
        .on('errors', (root, nodeStatsArray) => {
          reject(nodeStatsArray)
        })
        .on('end', async () => {
          resolve()
        })
    })
  }

  /**
   * The walker function for a single file
   * @param {string} root - The directory to the file
   * @param {string} stats - The name of the file
   * @param {function} next - The callback function to continue
   * @return {Promise<void>}
   */
  async fileIteration (root, stats, next) {
    const targetDir = config.targetDir
    const templatesDir = config.templates
    const templatePath = path.resolve(targetDir, path.relative(templatesDir, path.resolve(root, stats.name)))
    const generationDataObject = {
      root,
      templates_dir: templatesDir,
      targetDir: targetDir,
      package: config.package,
      data: config,
      file_name: stats.name,
      segmentsCount: config.segmentsCount,
      mockServer: config.mockServer
    }
    if (this.isInterfaceFile(stats.name)) {
      // iterates over the interfaces array in the swagger object creating multiple interface files
      await (new GenerateInterfaceFiles(generationDataObject)).writeFiles()

    } else if ((config.mockServer && this.isMockFile(stats.name)) || this.isStubFile(stats.name) || this.isOpertationFile(stats.name)) {
      // this file should be handled for each in swagger.paths creating multiple path based files, eg domains or routes etc etc
      await generateOperationFiles(generationDataObject)

    } else {
      // standard tpl file, no iterations, simple parse with the generationDataObject
      await generateFile(generationDataObject, isFirstRun)
    }
    if (templatePath.substr(templatePath.length - 3) === 'njk') {
      fs.removeSync(templatePath)
    }
    next()
  }

  isOpertationFile (name) {
    return name.substr(0, 3) === '___op'
  }

  isMockFile (name) {
    return name.substr(0, 3) === '___mock'
  }

  isStubFile (name) {
    return name.substr(0, 3) === '___stub'
  }

  isInterfaceFile (name) {
    return name.substr(0, 3) === '___interface'
  }
}

module.exports = new FileWalker()
