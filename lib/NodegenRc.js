const fs = require('fs-extra')
const path = require('path')

class NodegenRc {
  /**
   * Fetched a local rc file or for a fresh install from the tpl directory
   * @param {string} tplDir - The tpl directory
   */
  async fetch (tplDir) {
    const base = process.cwd()
    const rcName = '.nodegenrc'
    const localPath = path.join(base, rcName)
    if (fs.pathExistsSync(localPath)) {
      return this.validate(fs.readJsonSync(localPath))
    } else {
      return this.validate(fs.readJsonSync(path.join(tplDir, rcName)))
    }
  }

  /**
   * Validates the nodegenRc object to ensure the mandatory fields are present.
   * @param nodegenRcOject
   * @return {{nodegenDir}|*}
   */
  validate (nodegenRcOject) {
    if (!nodegenRcOject.nodegenDir) {
      throw new Error('Missing .nodegenrc attribute: nodegenDir')
    }
    return nodegenRcOject
  }
}

module.exports = new NodegenRc()
