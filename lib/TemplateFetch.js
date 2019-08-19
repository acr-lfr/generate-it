const commandRun = require('./commandRun')
const camelCaseStringReplacement = require('./helpers/camelCaseStringReplacement')
const path = require('path')

class TemplateFetchURL {
  calculateLocalDirectoryFromUrl (url) {
    const camelCaseUrl = camelCaseStringReplacement(url, ['/', ':', '.', '?', '#'])
    return path.join(process.cwd(), 'node_modules/openapi-nodegen/cache', camelCaseUrl)
  }

  async git (url) {
    const cacheDirectory = this.calculateLocalDirectoryFromUrl(url)
    await commandRun('git', ['clone', url, cacheDirectory])
    return cacheDirectory
  }

  async resolveTemplateType (input) {
    if (input.substring(0, 8) === 'https://') {
      return await this.git(input)
    } else {
      return path.join(__dirname, '../templates/' + input)
    }
  }
}

module.exports = new TemplateFetchURL()
