const generateBaseStructure = require('./generateBaseStructure')
const resetNodegenFolder = require('./resetNodegenFolder')
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
module.exports = config => new Promise((resolve, reject) => {
  const target_dir = config.target_dir
  const templates_dir = config.templates

  let IS_FIRST_RUN = false
  if (!fs.existsSync(path.join(target_dir, 'src'))) {
    IS_FIRST_RUN = true
    generateBaseStructure(target_dir, templates_dir, (config.mockServer) ? { mockingServer: true } : {})
  } else {
    // reset the nodegen folder
    resetNodegenFolder(target_dir, templates_dir, config.mockServer)
  }

  // lastly inject the paths
  walk.walk(templates_dir, {
    followLinks: false
  })
    .on('file', async (root, stats, next) => {
      try {
        const template_path = path.resolve(target_dir, path.relative(templates_dir, path.resolve(root, stats.name)))
        if (stats.name.substr(0, 3) === '___') {
          // this file should be handled for each in swagger.paths
          await generateOperationFiles({
            root,
            templates_dir,
            target_dir,
            package: config.package,
            data: config,
            file_name: stats.name,
            mockServer: config.mockServer || false
          })
          fs.unlink(template_path, next)
          next()
        } else {
          if (config.mockServer || (!config.mockServer && stats.name.substring(stats.name.length - 9, stats.name.length) !== 'Generator')) {
            // this file should only exist once.
            await generateFile({
              root,
              templates_dir,
              target_dir,
              package: config.package,
              data: config,
              file_name: stats.name,
              mockServer: config.mockServer || false
            }, IS_FIRST_RUN)
          }
          next()
        }
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

  fs.copySync(config.swaggerFilePath, path.resolve(target_dir, 'dredd', 'swagger.yml'))
})
