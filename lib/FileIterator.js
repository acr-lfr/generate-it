const fs = require('fs-extra')
const GenerateInterfaceFiles = require('./GenerateInterfaceFiles')
const generateOperationFiles = require('./generateOperationFiles')
const generateOperationFile = require('./generateOperationFile')
const generateFile = require('./generateFile')
const isFileToIngore = require('./isFileToIngore')
const FileTypeCheck = require('./FileTypeCheck')
const path = require('path')
const walk = require('walk')

let config = {}
let isFirstRun
let files = {}

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
          await this.parseOpIndex()
          resolve()
        })
    })
  }

  /**
   * Generates the opIndex tpl file
   * @return {Promise<void>}
   */
  async parseOpIndex () {
    if (files[FileTypeCheck.OPERATION_INDEX]) {
      await generateOperationFile(
        files[FileTypeCheck.OPERATION_INDEX].generationDataObject,
        [],
        'index',
        true,
        {
          'operationFiles': files[FileTypeCheck.OPERATION].files
        }
      )
    }
  }

  /**
   * The walker function for a single file
   * @param {string} root - The directory to the file
   * @param {string} stats - The name of the file
   * @param {function} next - The callback function to continue
   * @return {Promise<void>}
   */
  async fileIteration (root, stats, next) {
    if (isFileToIngore(root, stats.name)) {
      return next()
    }
    global.veryVerboseLogging('Dir:' + root)
    global.veryVerboseLogging('File:' + stats.name)
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
    const fileType = FileTypeCheck.getFileType(generationDataObject.file_name)
    if (fileType === FileTypeCheck.INTERFACE) {
      global.veryVerboseLogging('Interface file: ' + generationDataObject.file_name)
      // iterates over the interfaces array in the swagger object creating multiple interface files
      await (new GenerateInterfaceFiles(generationDataObject)).writeFiles()

    } else if (
      (config.mockServer && fileType === FileTypeCheck.MOCK) ||
      fileType === FileTypeCheck.STUB || fileType === FileTypeCheck.OPERATION
    ) {
      global.veryVerboseLogging('Mock|Stub|Operation file: ' + generationDataObject.file_name)
      // this file should be handled for each in swagger.paths creating multiple path based files, eg domains or routes etc etc
      files[fileType] = {
        files: await generateOperationFiles(generationDataObject),
        generationDataObject: generationDataObject
      }
    } else if (fileType === FileTypeCheck.OPERATION_INDEX) {
      files[fileType] = {
        generationDataObject: generationDataObject
      }
    } else if (fileType === FileTypeCheck.OTHER) {
      // standard tpl file, no iterations, simple parse with the generationDataObject
      await generateFile(generationDataObject, isFirstRun)

    }
    if (templatePath.substr(templatePath.length - 3) === 'njk') {
      fs.removeSync(templatePath)
    }
    global.veryVerboseLogging(root)
    next()
  }
}

module.exports = new FileWalker()
