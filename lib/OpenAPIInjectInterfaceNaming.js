const _ = require('lodash')
const openApiTypeToTypscriptType = require('./openApiTypeToTypscriptType')
const generateOperationId = require('./generateOperationId')

class OpenAPIInjectInterfaceNaming {
  constructor (jsObject) {
    this.apiObject = jsObject
  }

  /**
   * Merges the parameter namings into the path objects
   * @return {{paths}|module.exports.apiObject|{}}
   */
  inject () {
    if (this.isOpenAPI3()) {
      throw new Error('Currently openApi 3 is not supported')
    }
    if (this.isSwagger()) {
      return this.swaggerPathIterator('swaggerXInjector')
    }
  }

  /**
   * Merges the injected request params into single interface objects
   */
  mergeParameters () {
    if (this.isOpenAPI3()) {
      throw new Error('Currently openApi 3 is not supported')
    }
    if (this.isSwagger()) {
      return this.swaggerPathIterator('mergeSwaggerInjectedParameters')
    }
  }

  /**
   * @param {string} ref
   * @return {string}
   */
  convertRefToOjectPath (ref) {
    let path = []
    ref.split('/').forEach((part) => {
      if (part !== '#') {
        path.push(part)
      }
    })
    return path.join('.')
  }

  /**
   * True is apiobject is swagger
   * @return {boolean}
   */
  isSwagger () {
    return !!(this.apiObject.swagger && this.apiObject.swagger === '2.0')
  }

  /**
   * True is apiobject is openapi
   * @return {boolean}
   */
  isOpenAPI3 () {
    return !!(this.apiObject.openapi)
  }

  /**
   * Injects x-[request|response]-definitions into the main object
   * @return {{paths}|module.exports.apiObject|{paths}|{}}
   */
  swaggerPathIterator (pathModifierMethod) {
    if (!this.apiObject.paths) {
      throw new Error('No paths found to iterate over')
    }
    Object.keys(this.apiObject.paths).forEach((path) => {
      Object.keys(this.apiObject.paths[path]).forEach((method) => {
        this[pathModifierMethod](path, method)
      })
    })
    return this.apiObject
  }

  /**
   * Injects param/definition paths
   * @param {string} path - Path of api
   * @param {string} method - Method of path to x inject to
   */
  swaggerXInjector (path, method) {
    this.apiObject.paths[path][method]['x-request-definitions'] = this.injectFromSwaggerpaths(path, method)
    this.apiObject.paths[path][method]['x-response-definitions'] = this.injectFromSwaggerResponse(path, method)
  }

  /**
   * Calculates and injects the parameters into the main api object
   * @param path
   * @param method
   * @return {{headers: [], path: [], query: [], body: []}}
   */
  injectFromSwaggerpaths (path, method) {
    let requestParams = {
      body: {
        name: _.upperFirst(generateOperationId(_.upperFirst(method) + 'Body', path)),
        params: []
      },
      headers: {
        name: _.upperFirst(generateOperationId(_.upperFirst(method) + 'Headers', path)),
        params: []
      },
      path: {
        name: _.upperFirst(generateOperationId(_.upperFirst(method) + 'Path', path)),
        params: []
      },
      query: {
        name: _.upperFirst(generateOperationId(_.upperFirst(method) + 'Query', path)),
        params: []
      }
    }
    if (this.apiObject.paths[path][method].parameters) {
      this.apiObject.paths[path][method].parameters.forEach((p) => {
        if (p['$ref'] || (p.schema && p.schema['$ref'])) {
          try {
            const paramPath = this.convertRefToOjectPath(p['$ref'] || p.schema['$ref'])
            const parameterObject = _.get(this.apiObject, paramPath)
            requestParams[parameterObject.in || p.in].params.push(paramPath)
            if (p.schema) {
              requestParams.body.interfaceName = paramPath.split('.').pop()
            }
          } catch (e) {
            console.error(e)
          }
        }
      })
    }
    return requestParams
  }

  /**
   * Inject the interfaces for query|path|header paramters and leave the path to the body definition
   * @param path
   * @param method
   */
  mergeSwaggerInjectedParameters (path, method) {
    Object.keys(this.apiObject.paths[path][method]['x-request-definitions']).forEach((requestType) => {
      let requestObject = {}
      let clear = true
      this.apiObject.paths[path][method]['x-request-definitions'][requestType].params.forEach((requestPath) => {
        const parameterObject = _.get(this.apiObject, requestPath)
        clear = false
        if (requestType === 'body') {
          // make object from body
        } else {
          let name = parameterObject.name
          name += (!parameterObject.required) ? '?' : ''
          requestObject[name] = openApiTypeToTypscriptType(parameterObject.type)
        }
      })
      if (!clear) {
        this.apiObject.paths[path][method]['x-request-definitions'][requestType].interfaceText = this.objectToInterfaceString(requestObject)
      } else {
        delete this.apiObject.paths[path][method]['x-request-definitions'][requestType]
      }
    })
  }

  /**
   * Convert interface object to string
   * @param object
   * @return {string}
   */
  objectToInterfaceString (object) {
    let text = ''
    Object.keys(object).forEach((key) => {
      text += key + ':' + object[key] + ','
    })
    return text
  }

  /**
   * Injects the request interface naming for the response objects
   * @param path
   * @param method
   * @return {{'200': null}}
   */
  injectFromSwaggerResponse (path, method) {
    let response = {
      '200': null,
    }
    const pathResponses = this.apiObject.paths[path][method].responses || false
    if (pathResponses && pathResponses['200'] && pathResponses['200'].schema && pathResponses['200'].schema['$ref']) {
      try {
        response['200'] = this.convertRefToOjectPath(pathResponses['200'].schema['$ref']).split('.').pop()
      } catch (e) {
        console.error(e)
      }
    }
    return response
  }
}

module.exports = OpenAPIInjectInterfaceNaming
