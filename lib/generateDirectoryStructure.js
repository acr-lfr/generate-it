const generateBaseStructure = require('./generateBaseStructure')
const resetNodegenFolder = require('./resetNodegenFolder')
const generateModelFiles = require('./generateModelFiles')
const generateOperationFiles = require('./generateOperationFiles')
const generateFile = require('./generateFile')
const walk = require('walk')
const fs = require('fs-extra')
const path = require('path')

/**
 * Generates the directory structure.
 *
 * @private
 * @param  {Object}        config Configuration options
 * @param  {Object|String} config.swagger Swagger JSON or a string pointing to a Swagger file.
 * @param  {String}        config.target_dir Absolute path to the directory where the files will be generated.
 * @param  {String}        config.templates Absolute path to the templates that should be used.
 * @return {Promise}
 */
module.exports = (config) => new Promise((resolve, reject) => {
  const targetDir = config.target_dir
  const templatesDir = config.templates

  let IS_FIRST_RUN = false
  if (!fs.existsSync(path.join(targetDir, 'src'))) {
    IS_FIRST_RUN = true
    generateBaseStructure(targetDir, templatesDir, (config.mockServer) ? {
      mockingServer: true
    } : {})
  } else {
    // reset the nodegen folder
    resetNodegenFolder(targetDir, templatesDir, config.mockServer)
  }

  // lastly inject the paths
  walk.walk(templatesDir, {
    followLinks: false
  })
    .on('file', async (root, stats, next) => {
      try {
        const templatePath = path.resolve(targetDir, path.relative(templatesDir, path.resolve(root, stats.name)))
        if (templatePath.indexOf('http/nodegen/interfaces') !== -1 && stats.name.substr(0, 9) === '___') {
          await generateModelFiles({
            root,
            templates_dir: templatesDir,
            target_dir: targetDir,
            package: config.package,
            data: config,
            file_name: stats.name,
            segmentsCount: config.segmentsCount,
            mockServer: config.mockServer
          })
        } else if (stats.name.substr(0, 3) === '___') {
          // this file should be handled for each in swagger.paths
          await generateOperationFiles({
            root,
            templates_dir: templatesDir,
            target_dir: targetDir,
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
              target_dir: targetDir,
              package: config.package,
              data: config,
              file_name: stats.name,
              segmentsCount: config.segmentsCount,
              mockServer: config.mockServer
            }, IS_FIRST_RUN)
          }
        }
        if (templatePath.substr(templatePath.length - 3) === 'njk') {
          fs.removeSync(templatePath)
        }
        next()
      } catch (e) {
        reject(e)
      }
    })
    .on('errors', (root, nodeStatsArray) => {
      reject(nodeStatsArray)
    })
    .on('end', async () => {
      resolve()
    })

  fs.copySync(config.swaggerFilePath, path.resolve(targetDir, 'dredd', 'swagger.yml'))
})
