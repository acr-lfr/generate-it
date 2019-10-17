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
      return this.validate(localPath)
    } else {
      const tplRcFilePath = path.join(tplDir, rcName)
      if (!fs.pathExistsSync(tplRcFilePath)) {
        throw new Error('The tpl directory you are trying to use does not have a ' + rcName + ' file. Aborting the process.')
      }
      return this.validate(tplRcFilePath)
    }
  }
  /**
   * Parses and validates a provided nodegenrc file
   * @param nodegenPath
   * @return {{nodegenDir}|*}
   */
  validate (nodegenPath) {
    const nodegenRcOject = fs.readJsonSync(nodegenPath)
    if (!nodegenRcOject.nodegenDir) {
      throw new Error('Missing .nodegenrc attribute: nodegenDir')
    }
    if (!nodegenRcOject.nodegenType) {
      throw new Error('Missing .nodegenrc attribute: nodegenType. Please ensure the tpl direct has at least server or client')
    }
    if (!nodegenRcOject.nodegenMockDir) {
      throw new Error('Missing .nodegenrc attribute: nodegenMockDir')
    }
    return nodegenRcOject
  }
}

module.exports = new NodegenRc()
