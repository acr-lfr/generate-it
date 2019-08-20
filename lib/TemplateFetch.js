const commandRun = require('./commandRun')
const camelCaseStringReplacement = require('./helpers/camelCaseStringReplacement')
const fs = require('fs-extra')
const path = require('path')

class TemplateFetchURL {
  getCacheFolder(){
    return path.join(process.cwd(), 'node_modules/openapi-nodegen/cache')
  }
  /**
   * Generates a cache directory relative to the url given
   * @param url
   * @return {string}
   */
  calculateLocalDirectoryFromUrl (url) {
    const camelCaseUrl = camelCaseStringReplacement(url, ['/', ':', '.', '-', '?', '#'])
    return path.join(this.getCacheFolder(), camelCaseUrl)
  }

  /**
   * Deletes the entire cache directory
   */
  cleanAllCache(){
    fs.removeSync(this.getCacheFolder())
  }

  /**
   * Throws an error if gitFetch is not installed
   * @return {Promise<boolean>}
   */
  async hasGit () {
    try {
      await commandRun('git', ['--help'])
      return true
    } catch (e) {
      console.error('No gitFetch cli found on this operating system')
      return false
    }
  }

  /**
   * Runs a simple cache exists on the proposed local file path
   * @param path
   * @return {boolean}
   */
  gitCacheExists (path) {
    return fs.existsSync(path)
  }

  /**
   * Fetches the contents of a gitFetch url to the local cache
   * @param {string} url - Url to fetch via gitFetch
   * @return {Promise<string>}
   */
  async gitFetch (url) {
    if (!await this.hasGit()) {
      throw new Error('Could not fetch cache from gitFetch url as gitFetch is not locally installed')
    }
    const cacheDirectory = this.calculateLocalDirectoryFromUrl(url)
    try {
      if (this.gitCacheExists(cacheDirectory)) {
        await this.gitPull(cacheDirectory)
      } else {
        await this.gitClone(url, cacheDirectory)
      }
    } catch (e) {
      console.log('could not clone or pull the given git repository, removing cache folder')
      fs.removeSync(cacheDirectory)
      throw e
    }
    return cacheDirectory
  }

  /**
   * Changes directory then pulls an expected git repo
   * @param cacheDirectory
   * @return {Promise<boolean>}
   */
  async gitPull (cacheDirectory) {
    const cwd = process.cwd()
    process.chdir(cacheDirectory)
    try {
      console.log('Updating git cache')
      await commandRun('git', ['pull'], true)
      process.chdir(cwd)
      return true
    } catch (e) {
      process.chdir(cwd)
      throw e
    }
  }

  /**
   * Clones a remote git url to a given local directory
   * @param url
   * @param cacheDirectory
   * @return {Promise<*>}
   */
  async gitClone (url, cacheDirectory) {
    console.log('Clone git repository')
    return commandRun('git', ['clone', url, cacheDirectory], true)
  }

  /**
   * Returns local template name or full path to cached directory
   * @param input
   * @return {Promise<string>}
   */
  async resolveTemplateType (input) {
    if (input.substring(0, 8) === 'https://') {
      return await this.gitFetch(input)
    } else {
      return path.join(__dirname, '../templates/' + input)
    }
  }
}

module.exports = new TemplateFetchURL()
