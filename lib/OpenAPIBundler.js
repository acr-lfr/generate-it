const fs = require('fs')
const path = require('path')
const YAML = require('js-yaml')
const RefParser = require('json-schema-ref-parser')
const OpenAPIInjectInterfaceNaming = require('./OpenAPIInjectInterfaceNaming')

class OpenAPIBundler {
  async bundle (filePath) {
    let content, parsedContent, parsedContentWithInterfaceNaming, dereferencedJSON, mergedParameters, bundledJSON

    try {
      content = await this.getFileContent(filePath)
    } catch (e) {
      console.error('Can not load the content of the Swagger specification file')
      console.error(e)
      return
    }

    try {
      parsedContent = this.parseContent(content)
    } catch (e) {
      console.error('Can not parse the content of the Swagger specification file')
      console.error(e)
      return
    }

    try {
      parsedContentWithInterfaceNaming = (new OpenAPIInjectInterfaceNaming(parsedContent)).inject()
    } catch (e) {
      console.error('Can not dereference the JSON obtained from the content of the Swagger specification file')
      console.error(e)
      return
    }

    try {
      dereferencedJSON = await this.dereference(parsedContentWithInterfaceNaming)
    } catch (e) {
      console.error('Can not dereference the JSON obtained from the content of the Swagger specification file')
      console.error(e)
      return
    }

    try {
      mergedParameters = (new OpenAPIInjectInterfaceNaming(dereferencedJSON).mergeParameters())
    } catch (e) {
      console.error('Can not merge the request paramters to build the interfaces:')
      console.error(e)
      return
    }

    try {
      bundledJSON = await this.bundleObject(mergedParameters)
    } catch (e) {
      console.error('Can not bundle the JSON obtained from the content of the Swagger specification file')
      console.error(e)
      return
    }
    global.verboseLogging(bundledJSON)
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
}

module.exports = new OpenAPIBundler()
