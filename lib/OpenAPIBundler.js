const fs = require('fs')
const path = require('path')
const YAML = require('js-yaml')
const RefParser = require('json-schema-ref-parser')
const OpenAPIInjectInterfaceNaming = require('./OpenAPIInjectInterfaceNaming')
const generateSwaggerDefinitionToTypescriptInterface = require('./generateSwaggerDefinitionToTypescriptInterface')

class OpenAPIBundler {
  async bundle (filePath) {
    let content, parsedContent, parsedContentWithInterfaceNaming, dereferencedJSON, mergedParameters, injectedInterfaces, bundledJSON

    try {
      content = await this.getFileContent(filePath)
    } catch (e) {
      console.error('Can not load the content of the Swagger specification file')
      throw e
    }

    try {
      parsedContent = this.parseContent(content)
    } catch (e) {
      console.error('Can not parse the content of the Swagger specification file')
      throw e
    }

    try {
      parsedContentWithInterfaceNaming = (new OpenAPIInjectInterfaceNaming(parsedContent)).inject()
    } catch (e) {
      console.error('Can not dereference the JSON obtained from the content of the Swagger specification file')
      throw e
    }

    try {
      dereferencedJSON = await this.dereference(parsedContentWithInterfaceNaming)
    } catch (e) {
      console.error('Can not dereference the JSON obtained from the content of the Swagger specification file')
      throw e
    }

    try {
      mergedParameters = (new OpenAPIInjectInterfaceNaming(dereferencedJSON)).mergeParameters()
    } catch (e) {
      console.error('Can not merge the request paramters to build the interfaces:')
      throw e
    }
    try {
      injectedInterfaces = this.injectInterfaces(mergedParameters)
    } catch (e) {
      console.error('Cannot inject the interfaces:')
      throw e
    }
    global.verboseLogging(injectedInterfaces)
    process.exit(0)
    try {
      bundledJSON = await this.bundleObject(injectedInterfaces)
    } catch (e) {
      console.error('Cannot bundle the object:')
      throw e
    }
    global.verboseLogging(bundledJSON)
    process.exit(0)

    return JSON.parse(JSON.stringify(bundledJSON))
  }

  async getFileContent (filePath) {
    return fs.readFileSync(path.resolve(__dirname, filePath))
  }

  parseContent (content) {
    content = content.toString('utf8')
    try {
      return JSON.parse(content)
    } catch (e) {
      return YAML.safeLoad(content)
    }
  }

  async dereference (json) {
    return RefParser.dereference(json, {
      dereference: {
        circular: 'ignore'
      }
    })
  }

  async bundleObject (json) {
    return RefParser.bundle(json, {
      dereference: {
        circular: 'ignore'
      }
    })
  }

  /**
   *
   * @param apiObject Dereference'd' object
   * @return {Promise<void>}
   */
  injectInterfaces (apiObject) {
    apiObject.interfaces = []
    Object.keys(apiObject.definitions).forEach((definitionName) => {
      const definitionObject = apiObject.definitions[definitionName]
      apiObject.interfaces.push({
        name: definitionName,
        content: this.generateInterfaceText(definitionObject)
      })
    })
    Object.keys(apiObject.paths).forEach((path) => {
      Object.keys(apiObject.paths[path]).forEach((method) => {
        if (apiObject.paths[path][method]['x-request-definitions']) {
          Object.keys(apiObject.paths[path][method]['x-request-definitions']).forEach((paramType) => {
            apiObject.interfaces.push({
              name: apiObject.paths[path][method]['x-request-definitions'][paramType].name,
              content: apiObject.paths[path][method]['x-request-definitions'][paramType].interfaceText
            })
          })
        }
      })
    })
    apiObject.interfaces = apiObject.interfaces.sort((a, b) => (a.name > b.name) ? 1 : -1)
    return apiObject
  }

  generateInterfaceText (definitionObject) {
    if (definitionObject.type === 'array') {
      definitionObject.type = 'array-interface'
    }
    return generateSwaggerDefinitionToTypescriptInterface(definitionObject, null, false)
  }
}

module.exports = new OpenAPIBundler()
