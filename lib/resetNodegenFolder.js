const fs = require('fs-extra')
const path = require('path')

/**
 *
 * @param {string} targetDir
 * @param {string} templatesDir
 * @param {boolean} mocked
 * @param nodegenRc
 */
module.exports = (targetDir, templatesDir, mocked = false, nodegenRc) => {
  const nodeGenDir = nodegenRc.nodegenDir
  const copyFilter = {
    filter: (src) => {
      // ensure the njk files are not copied over
      return (src.indexOf('.njk') === -1)
    }
  }
  fs.removeSync(path.join(targetDir, nodeGenDir))
  fs.copySync(
    path.join(templatesDir, nodeGenDir),
    path.join(targetDir, nodeGenDir),
    copyFilter
  )
  if (mocked) {
    const mocksDir = nodegenRc.nodegenMockDir
    fs.removeSync(path.join(targetDir, mocksDir))
    fs.copySync(
      path.join(templatesDir, mocksDir),
      path.join(targetDir, mocksDir),
      copyFilter
    )
  }
}
