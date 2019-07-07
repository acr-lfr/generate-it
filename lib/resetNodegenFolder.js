const fs = require('fs-extra')
const path = require('path')

/**
 *
 * @param {string} target_dir
 * @param {string} templates_dir
 * @param {boolean} mocked
 */
module.exports = (target_dir, templates_dir, mocked = false) => {
  console.log('Resetting the nodegen directory')
  const nodeGenDir = 'src/http/nodegen'
  const copyFilter = {
    filter: (src) => {
      // ensure the njk files are not copied over
      return (src.indexOf('.njk') === -1)
    }
  }
  fs.removeSync(path.join(target_dir, nodeGenDir))
  fs.copySync(
    path.join(templates_dir, nodeGenDir),
    path.join(target_dir, nodeGenDir),
    copyFilter
  )
  if (mocked) {
    const mocksDir = 'src/domains/__mocks__'
    fs.removeSync(path.join(target_dir, mocksDir))
    fs.copySync(
      path.join(templates_dir, mocksDir),
      path.join(target_dir, mocksDir),
      copyFilter
    )
  }
}
