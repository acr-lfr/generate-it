const randomName = require('project-name-generator')().dashed
const os = require('os')
const path = require('path')
const _ = require('lodash')

/**
 * Creates an extended config object
 * @param {object} config
 * @param {} swagger
 * @param templates
 * @return {Promise<{mockServer}|*>}
 */
module.exports = async (config, swagger, templates) => {
  config.swagger = swagger
  _.defaultsDeep(config, {
    swagger: {
      info: {
        title: randomName
      }
    },
    package: {
      name: _.kebabCase(_.result(config, 'swagger.info.title', randomName))
    },
    target_dir: path.resolve(os.tmpdir(), 'swagger-node-generated-code'),
    templates: templates,
    ignoredModules: config.ignoredModules,
    segmentsCount: config.segmentsCount,
    mockServer: config.mockServer || false,
  })
  return config
}
