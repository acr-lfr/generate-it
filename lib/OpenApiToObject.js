const _ = require('lodash')
const wrap = require('word-wrap')
const OpenAPIBundler = require('./OpenAPIBundler')
const generateOperationId = require('./generateOperationId')
const validHttpMethods = require('./validHttpMethods')

class OpenApiToObject {
  /**
   * @param  {Object} config File path to Swagger file or **fully bundled and dereferenced** Swagger JS object.
   */
  constructor (config) {
    this.apiFile = config.swaggerFilePath
    this.config = config
  }

  async build () {
    if (typeof this.apiFile === 'string') {
      return this.iterateObject(await OpenAPIBundler.bundle(this.apiFile, this.config))
    } else if (typeof this.apiFile !== 'object') {
      throw new Error(`Could not find a valid swagger definition: ${this.apiFile}`)
    } else {
      return this.iterateObject(this.apiFile)
    }
  }

  iterateObject (apiObject) {
    apiObject.basePath = apiObject.basePath || ''
    _.each(apiObject.paths, (path, pathName) => {
      path.endpointName = pathName === '/' ? 'root' : pathName.split('/')[1]
      _.each(path, (method, methodName) => {
        if (validHttpMethods.indexOf(methodName.toUpperCase()) === -1) {
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

    apiObject.endpoints = _.uniq(_.map(apiObject.paths, 'endpointName'))
    return apiObject
  }
}

module.exports = OpenApiToObject
