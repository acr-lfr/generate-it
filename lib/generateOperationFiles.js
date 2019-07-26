const _ = require('lodash')
const generateOperationFile = require('./generateOperationFile')

/**
 * Generates all the files for each operation by iterating over the operations.
 *
 * @param   {Object}  config Configuration options
 * @returns {Promise}
 */
module.exports = config => new Promise((resolve, reject) => {
  const files = {}
  _.each(config.data.swagger.paths, (operation_path, path_name) => {
    let operation_name
    const segments = path_name.split('/').filter(s => s && s.trim() !== '')
    let joinedSegments
    if (segments.length > config.segmentsCount) {
      segments.splice(config.segmentsCount)
      operation_name = segments.join(' ').toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      joinedSegments = segments.join('/')
    } else {
      operation_name = operation_path.endpointName
      joinedSegments = operation_name
    }

    if (files[operation_name] === undefined) {
      files[operation_name] = []
    }

    path_name = path_name.replace(/}/g, '').replace(/{/g, ':')
    files[operation_name].push({
      path_name,
      path: operation_path,
      subresource: (path_name.substring(joinedSegments.length + 1) || '/').replace(/}/g, '').replace(/{/g, ':')
    })

    Promise.all(
      _.map(files, (operation, operation_name) => {
        return generateOperationFile(config, operation, operation_name)
      })
    ).then(resolve).catch(reject)
    resolve()
  })
})
