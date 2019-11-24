const fs = require('fs-extra');
const path = require('path');

class NodegenRc {
  /**
   * Fetched a local rc file or for a fresh install from the tpl directory
   * @param {string} tplDir - The tpl directory
   * @param targetDir
   */
  public async fetch (tplDir: string, targetDir: string) {
    const base = targetDir;
    const rcName = '.nodegenrc';
    const localPath = path.join(base, rcName);
    if (fs.pathExistsSync(localPath)) {
      return this.validate(localPath);
    } else {
      const tplRcFilePath = path.join(tplDir, rcName);
      if (!fs.pathExistsSync(tplRcFilePath)) {
        throw new Error('The tpl directory you are trying to use does not have a ' + rcName + ' file. Aborting the process.');
      }
      fs.copySync(tplRcFilePath, localPath);
      return this.validate(localPath);
    }
  }

  /**
   * Parses and validates a provided nodegenrc file
   * @param localNodegenPath
   * @return {{nodegenDir}|*}
   */
  public validate (localNodegenPath: string) {
    const nodegenRcOject = fs.readJsonSync(localNodegenPath);
    if (!nodegenRcOject.nodegenDir) {
      throw new Error('Missing .nodegenrc attribute: nodegenDir');
    }
    if (!nodegenRcOject.nodegenMockDir) {
      throw new Error('Missing .nodegenrc attribute: nodegenMockDir');
    }
    return nodegenRcOject;
  }
}

export default new NodegenRc();
