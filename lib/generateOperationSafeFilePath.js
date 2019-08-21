const fs = require('fs-extra')
const path = require('path')
module.exports = (targetParentDirectory, subDirectory, newFilename) => {
  fs.ensureDirSync(path.join(targetParentDirectory, '.openapi-nodegen/'))
}
