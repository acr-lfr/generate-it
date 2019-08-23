const fs = require('fs-extra')
const path = require('path')
const fileDiff = require('./fileDiff')

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
module.exports = async (targetFile, targetParentDirectory, subDirectory, newFilename, newFileString) => {
  const compareDir = path.join(targetParentDirectory, '.openapi-nodegen/cache/compare')
  fs.ensureDirSync(compareDir)
  const backupComparePath = path.join(compareDir, subDirectory, newFilename)
  if (!fs.existsSync(backupComparePath)) {
    console.warn('WARNING STUB FILE WITHOUT COMPARISON: ' + targetFile)
    console.warn('You will have to manually compare the differences between your stub file (eg a domain file) and your expected methods.')
    console.log(backupComparePath)
    console.log(' ')
    fs.existsSync(backupComparePath)
  } else {
    await fileDiff(
      targetFile,
      String(fs.readFileSync(backupComparePath)),
      newFileString
    )
  }
  fs.ensureFileSync(backupComparePath)
  return fs.writeFileSync(backupComparePath, newFileString, 'utf8')
}
