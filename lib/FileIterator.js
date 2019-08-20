const fs = require('fs-extra')
const GenerateModelFiles = require('./GenerateModelFiles')
const generateOperationFiles = require('./generateOperationFiles')
const generateFile = require('./generateFile')
const path = require('path')
const walk = require('walk')
let config = {}
class FileWalker{
  walk(isFirstRun, providedConfig){
    config = providedConfig
    this.isFirstRun = isFirstRun
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

  async fileIteration(root, stats, next){
    const targetDir = config.targetDir
    const templatesDir = config.templates
    const templatePath = path.resolve(targetDir, path.relative(templatesDir, path.resolve(root, stats.name)))
    if (templatePath.indexOf('http/nodegen/interfaces') !== -1 && stats.name.substr(0, 3) === '___') {
      await (new GenerateModelFiles({
        root,
        templates_dir: templatesDir,
        targetDir: targetDir,
        package: config.package,
        data: config,
        file_name: stats.name,
        segmentsCount: config.segmentsCount,
        mockServer: config.mockServer
      })).writeFiles()
    } else if (stats.name.substr(0, 3) === '___') {
      // this file should be handled for each in swagger.paths
      await generateOperationFiles({
        root,
        templates_dir: templatesDir,
        targetDir: targetDir,
        package: config.package,
        data: config,
        file_name: stats.name,
        segmentsCount: config.segmentsCount,
        mockServer: config.mockServer
      })
    } else {
      if (config.mockServer || (!config.mockServer && stats.name.substring(stats.name.length - 9, stats.name.length) !== 'Generator')) {
        // this file should only exist once.
        await generateFile({
          root,
          templates_dir: templatesDir,
          targetDir: targetDir,
          package: config.package,
          data: config,
          file_name: stats.name,
          segmentsCount: config.segmentsCount,
          mockServer: config.mockServer
        }, this.isFirstRun)
      }
    }
    if (templatePath.substr(templatePath.length - 3) === 'njk') {
      fs.removeSync(templatePath)
    }
    next()
  }
}

module.exports = new FileWalker()
