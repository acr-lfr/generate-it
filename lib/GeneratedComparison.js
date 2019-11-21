require('colors')
const fs = require('fs-extra')
const path = require('path')
const fileDiff = require('./fileDiff')
const consoleHorizontalRule = require('./consoleHorizontalRule')

const COMPARE_DIRECTORY = '.openapi-nodegen/cache/compare'
const MAX_CACHE_COUNT = 5

class GeneratedComparison {

  getCacheBaseDir (targetParentDirectory) {
    return path.join(targetParentDirectory, COMPARE_DIRECTORY)
  }

  /**
   * Retutns a path to the config cache compare dir
   * @param {string} targetParentDirectory - The
   * @return {string}
   */
  getCacheCompareConfigPath (targetParentDirectory) {
    return path.join(this.getCacheBaseDir(targetParentDirectory), 'config.json')
  }

  /**
   * fetch the config json from the compare dir
   * @param jsonFilePath
   * @return {{versions: {}}}
   */
  getCacheCompareJson (jsonFilePath) {
    let json
    if (fs.pathExistsSync(jsonFilePath)) {
      json = fs.readJsonSync(jsonFilePath)
    } else {
      json = {
        versions: {}
      }
    }
    return json
  }

  /**
   * Ensures the compare dir exists and returns its path
   * @param targetParentDirectory
   * @return {string}
   */
  getCompareDirectory (targetParentDirectory) {
    const compareDir = path.join(targetParentDirectory, COMPARE_DIRECTORY)
    fs.ensureDirSync(compareDir)
    return compareDir
  }

  /**
   *
   * @param targetParentDirectory
   * @return {Promise<string|*>}
   */
  fileDiffs (targetParentDirectory) {
    return new Promise((resolve, reject) => {
      const json = this.getCacheCompareJson(this.getCacheCompareConfigPath(targetParentDirectory))
      const versions = Object.keys(json.versions).sort()
      if (versions.length <= 1) {
        return console.log('No previous files to compare from, a diff comparison chart will be available after the next generation.')
      }
      const newVersionKey = versions.pop()
      const oldVersionKey = versions.pop()
      let error = false
      Object.keys(json.versions[newVersionKey]).forEach((directory) => {
        const newFilePath = path.join(directory, newVersionKey)
        if (json.versions[oldVersionKey][directory]) {
          const oldFilePath = path.join(directory, oldVersionKey)
          try {
            fileDiff(
              oldFilePath,
              newFilePath,
            )
              .then((diff) => {
                json.versions[newVersionKey][directory]['diff'] = diff
              })
              .catch((e) => {
                error = e
              })
          } catch (e) {
            error = e
          }
        }
      })
      return !error ? resolve(json.versions[newVersionKey]) : reject(error)
    })
  }

  /**
   * Console logs a table of file diffs
   * @param outputDir
   * @param input
   */
  fileDiffsPrint (outputDir, input) {
    if (typeof input === 'string') {
      return console.log(input)
    }
    let logDiffs = {}
    const cacheCompareDir = this.getCompareDirectory(outputDir)
    const buildDiff = function (add, minus) {
      this.added = add
      this.removed = minus
      this.message = (add > 0 || minus > 0) ? 'Diff print in full above' : 'No differences'
    }
    Object.keys(input).forEach((key) => {
      const displayPath = key.replace(cacheCompareDir, '')
      if (input[key].diff && input[key].diff.difference && input[key].diff.difference.length > 0) {
        console.log(' ')
        consoleHorizontalRule()
        console.log('START' + displayPath.bold)
        console.log(input[key].diff.difference)
        console.log(' ')
        console.log('END' + displayPath.bold)
        consoleHorizontalRule()
        console.log(' ')
      }
      logDiffs[displayPath] = new buildDiff(
        input[key].diff.plus,
        input[key].diff.minus
      )
    })
    console.table(logDiffs)
  }

  versionCleanup (targetParentDirectory) {
    const configPath = this.getCacheCompareConfigPath(targetParentDirectory)
    const json = this.getCacheCompareJson(configPath)
    const versions = Object.keys(json.versions).sort().reverse()
    if (versions.length >= MAX_CACHE_COUNT) {
      versions.forEach((version, i) => {
        if (i >= MAX_CACHE_COUNT) {
          let paths = Object.keys(json.versions[version])
          paths.forEach((singlePath, i) => {
            paths[i] = path.join(singlePath, '/', version)
          })
          paths.forEach((path) => {
            fs.removeSync(path)
          })
          delete json.versions[version]
        }
      })
    }
    fs.writeJsonSync(configPath, json, {
      spaces: 2
    })
  }

  /**
   * Compares the new content for the proposed stub file that already exists on the file system.
   * If there is not already a backup to compare, an error message is shown.
   * Once compared the new file contents are written to the backup location.
   * @param {string} targetFile - The target file the rendered content was destined for
   * @param {string} targetParentDirectory - The parent directory the output is destined for
   * @param {string} subDirectory - The sub-directory the target file was destined for
   * @param {string} newFilename - The new filename the output was for
   * @param {string} newFileString - The newly rendered content
   * @return {Promise<void>}
   */
  async generateComparisonFile (targetFile, targetParentDirectory, subDirectory, newFilename, newFileString) {
    const backupComparePath = path.join(this.getCompareDirectory(targetParentDirectory), subDirectory, newFilename)
    const backUpFile = path.join(backupComparePath, '/', global.startISOString)
    fs.ensureFileSync(backUpFile)
    fs.ensureDirSync(backupComparePath)
    this.addToCacheComparisonReport(
      this.getCacheCompareConfigPath(targetParentDirectory),
      backupComparePath,
      global.startISOString
    )
    return fs.writeFileSync(backUpFile, newFileString, 'utf8')
  }

  /**
   * Adds a new path to the current cache comparison json
   * @param {string} jsonFilePath - Path to the json config file
   * @param {string} backupComparePath - Path to add
   * @param {string} isoTimstamp - Current runtime timestamp
   * @return {void}
   */
  addToCacheComparisonReport (jsonFilePath, backupComparePath, isoTimstamp) {
    let json = this.getCacheCompareJson(jsonFilePath)
    if (!json.versions[isoTimstamp]) {
      json.versions[isoTimstamp] = {}
    }
    if (!json.versions[isoTimstamp][backupComparePath]) {
      json.versions[isoTimstamp][backupComparePath] = {
        diff: ''
      }
    }
    fs.writeJsonSync(jsonFilePath, json, {
      spaces: 2
    })
  }
}

module.exports = new GeneratedComparison()

