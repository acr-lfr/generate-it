const nunjucks = require('nunjucks')
const fs = require('fs-extra')

class TemplateRenderer {
  /**
   * Loads and renders a tpl
   * @param {string} inputString The string to parse
   * @param {object} customVars Custom variables passed to nunjucks
   * @param {object} additionalHelpers
   * @param configRcFile Fully qualified path to .openapi-nodegenrc file   *
   * @return {*}
   */
  load (inputString, customVars = {}, additionalHelpers = {}, configRcFile = '') {
    this.nunjucksSetup(
      Object.assign(require('./helpers/template/index'), additionalHelpers),
      configRcFile
    )
    global.verboseLogging(inputString, customVars)
    return nunjucks.renderString(inputString, customVars)
  }

  /**
   * Sets up the tpl engine for the current file being rendered
   * @param {object} helperFunctionKeyValueObject
   * @param configRcFile Exact path to a .boatsrc file
   */
  nunjucksSetup (helperFunctionKeyValueObject = {}, configRcFile = '') {
    let env = nunjucks.configure(this.nunjucksOptions(configRcFile))

    const processEnvVars = JSON.parse(JSON.stringify(process.env))
    for (let key in processEnvVars) {
      env.addGlobal(key, processEnvVars[key])
    }
    Object.keys(helperFunctionKeyValueObject).forEach((key) => {
      env.addGlobal(key, helperFunctionKeyValueObject[key])
    })
  }

  /**
   * Tries to inject the provided json from a .boatsrc file
   * @param configRcFile
   * @returns {{autoescape: boolean, tags: {blockStart: string, commentStart: string, variableEnd: string, variableStart: string, commentEnd: string, blockEnd: string}}|({autoescape: boolean, tags: {blockStart: string, commentStart: string, variableEnd: string, variableStart: string, commentEnd: string, blockEnd: string}} & Template.nunjucksOptions)}
   */
  nunjucksOptions (configRcFile = '') {
    let baseOptions = {
      autoescape: false,
      // tags: {
      //   blockStart: '<%',
      //   blockEnd: '%>',
      //   variableStart: '<$',
      //   variableEnd: '$>',
      //   commentStart: '<#',
      //   commentEnd: '#>'
      // }
    }
    try {
      let json = fs.readJsonSync(configRcFile)
      if (json.nunjucksOptions) {
        return Object.assign(baseOptions, json.nunjucksOptions)
      }
    } catch (e) {
      return baseOptions
    }
  }
}

module.exports = new TemplateRenderer()
