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
    const operation_name = operation_path.endpointName
    if (files[operation_name] === undefined) {
      files[operation_name] = []
    }

    path_name = path_name.replace(/}/g, '').replace(/{/g, ':')
    files[operation_name].push({
      path_name,
      path: operation_path,
      subresource: (path_name.substring(operation_name.length + 1) || '/').replace(/}/g, '').replace(/{/g, ':')
    })

    Promise.all(
      _.map(files, (operation, operation_name) => {
        return generateOperationFile(config, operation, operation_name)
      })
    ).then(resolve).catch(reject)
    resolve()
  })
})
