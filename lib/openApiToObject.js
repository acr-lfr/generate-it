/**
 * This module is used to accommodate Swagger 2 data for easier rendering.
 * @module swagger2
 */

const _ = require('lodash')
const wrap = require('word-wrap')
const OpenAPIBundler = require('./OpenAPIBundler')
const generateOperationId = require('./generateOperationId')

const iterate = (swagger) => {
  const authorizedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND']
  swagger.basePath = swagger.basePath || ''
  _.each(swagger.paths, (path, pathName) => {
    path.endpointName = pathName === '/' ? 'root' : pathName.split('/')[1]
    _.each(path, (method, methodName) => {
      if (authorizedMethods.indexOf(methodName.toUpperCase()) === -1) {
        return
      }

      method.operationId = _.camelCase(method.operationId || generateOperationId(methodName, pathName).replace(/\s/g, '-'))
      method.descriptionLines = wrap(method.description || method.summary || '', {
        width: 60, indent: ''
      }).split(/\n/)
      _.each(method.parameters, (param) => {
        param.type = param.type || (param.schema ? param.schema.type : undefined)
      })
    })
  })

  swagger.endpoints = _.uniq(_.map(swagger.paths, 'endpointName'))
  return swagger
}

/**
 * Accommodates Swagger object for easier rendering.
 *
 * @param  {String|Object} swagger File path to Swagger file or **fully bundled and dereferenced** Swagger JS object.
 * @return {Object}                The accommodated Swagger object.
 */
const openApiToObject = async (swagger) => {
  if (typeof swagger === 'string') {
    swagger = await OpenAPIBundler.bundle(swagger)
    return iterate(swagger)
  } else if (typeof swagger !== 'object') {
    throw new Error(`Could not find a valid swagger definition: ${swagger}`)
  } else {
    return iterate(swagger)
  }
}

module.exports = openApiToObject
