const prettier = require('prettier')
const fs = require('fs-extra')
const path = require('path')
const namingUtils = require('./helpers/NamingUtils')
const generateSwaggerDefinitionToTypescriptInterface = require('./generateSwaggerDefinitionToTypescriptInterface')
const TemplateRenderer = require('./TemplateRenderer')

class GenerateModelFiles {
  constructor (config) {
    this.config = config
  }

  async writeFiles () {
    const swagger = this.config.data.swagger
    Object.keys(swagger.definitions).forEach((definitionName) => {
      const definitionObject = this.config.data.swagger.definitions[definitionName]
      this.parseDefinition(this.generateInterfaceText(definitionObject), definitionName)
    })
    Object.keys(swagger.paths).forEach((path) => {
      Object.keys(swagger.paths[path]).forEach((method) => {
        if (swagger.paths[path][method]['x-request-definitions']) {
          Object.keys(swagger.paths[path][method]['x-request-definitions']).forEach((paramType) => {
            this.parseDefinition(
              swagger.paths[path][method]['x-request-definitions'][paramType].interfaceText,
              swagger.paths[path][method]['x-request-definitions'][paramType].name,
            )
          })
        }
      })
    })
  }

  generateInterfaceText (definitionObject) {
    if (definitionObject.type === 'array') {
      definitionObject.type = 'array-interface'
    }
    return generateSwaggerDefinitionToTypescriptInterface(definitionObject, null, false)
  }

  parseDefinition (interfaceText, definitionName) {
    const filePath = path.join(this.config.root, this.config.file_name)
    const data = fs.readFileSync(filePath, 'utf8')

    const subdir = this.config.root.replace(new RegExp(`${this.config.templates_dir}[/]?`), '')
    const ext = namingUtils.getFileExt(this.config.file_name)
    const newFilename = definitionName + '.' + ext
    const targetFile = path.resolve(this.config.targetDir, subdir, newFilename)

    let content = TemplateRenderer.load(data.toString(), {
      definitionName,
      definitionInterfaceText: interfaceText,
    })

    content = content.replace(new RegExp('&' + '#' + 'x27;', 'g'), '\'')
    content = prettier.format(content, {
      indent_size: 2,
      space_in_empty_paren: true,
      end_with_newline: true,
      semi: true,
      singleQuote: true,
      parser: ext === 'ts' ? 'typescript' : 'babel'
    })

    const moduleType = subdir.substring(subdir.lastIndexOf('/') + 1)
    if (this.config.data.ignoredModules && this.config.data.ignoredModules.includes(moduleType) && fs.existsSync(targetFile)) {
      throw new Error('file exists')
    }
    fs.writeFileSync(targetFile, content, 'utf8')

    return true
  }
}

module.exports = GenerateModelFiles
