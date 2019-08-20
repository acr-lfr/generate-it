const randomName = require('project-name-generator')().dashed
const _ = require('lodash')

/**
 * Creates an extended config object
 * @param {object} config
 * @param {object} swagger
 * @param templates
 * @return {Promise<{mockServer}|*>}
 */
module.exports = async (config, swagger, templates) => {
  config.swagger = swagger
  if(!config.swagger.info.title){
    config.swagger.info.title = randomName
  }
  config.package = config.package || {}
  if(!config.package.name){
    config.package.name = _.kebabCase(_.result(config, 'swagger.info.title', randomName))
  }
  config.templates = templates
  return config
}
