const fs = require('fs-extra')
const canCreateStdOperationFile = require('./canCreateStdOperationFile')
const GenerateInterfaceFiles = require('./GenerateInterfaceFiles')
const generateOperationFiles = require('./generateOperationFiles')
const generateFile = require('./generateFile')
const path = require('path')
const walk = require('walk')
let config = {}
let isFirstRun
class FileWalker {
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
    if (templatePath.indexOf('interfaces') !== -1 && stats.name.substr(0, 3) === '___') {
      // iterates over the interfaces array in the swagger object creating multiple interface files
      await (new GenerateInterfaceFiles(generationDataObject)).writeFiles()
    } else if (canCreateStdOperationFile(config.mockServer, root, stats.name)) {
      // this file should be handled for each in swagger.paths creating multiple path based files, eg domains or routes etc etc
      await generateOperationFiles(generationDataObject)
    } else if (stats.name.substr(0, 3) !== '___') {
      // standard tpl file, no iterations, simple parse with the generationDataObject
      await generateFile(generationDataObject, isFirstRun)
    }
    if (templatePath.substr(templatePath.length - 3) === 'njk') {
      fs.removeSync(templatePath)
    }
    next()
  }
}

module.exports = new FileWalker()
