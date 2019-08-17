const fs = require('fs-extra')
const path = require('path')

/**
 *
 * @param {string} targetDir
 * @param {string} templatesDir
 * @param {boolean} mocked
 */
module.exports = (targetDir, templatesDir, mocked = false) => {
  console.log('Resetting the nodegen directory')
  const nodeGenDir = 'src/http/nodegen'
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
    const mocksDir = 'src/domains/__mocks__'
    fs.removeSync(path.join(targetDir, mocksDir))
    fs.copySync(
      path.join(templatesDir, mocksDir),
      path.join(targetDir, mocksDir),
      copyFilter
    )
  }
}
