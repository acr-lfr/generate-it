import fs from 'fs-extra';
import path from 'path';
import { NodegenRc as NodegenRcInterface } from '@/interfaces/NodegenRc';

class NodegenRc {
  /**
   * Fetched a local rc file or for a fresh install from the tpl directory
   * @param {string} tplDir - The tpl directory
   * @param targetDir
   */
  public async fetch (tplDir: string, targetDir: string): Promise<NodegenRcInterface> {
    const rcPath = this.checkWhichExists(targetDir);

    if (rcPath) {
      return this.validate(rcPath);
    } else {
      const defaultName = '.nodegenrc';
      const tplRcFilePath = path.join(tplDir, defaultName);
      if (!fs.pathExistsSync(tplRcFilePath)) {
        throw new Error('The tpl directory you are trying to use does not have a .nodegenrc file. Aborting the process.');
      }
      const localPath = path.join(targetDir, defaultName);
      fs.copySync(tplRcFilePath, localPath);
      return this.validate(localPath);
    }
  }

  checkWhichExists (basePath: string): string | false {
    const rcNames = ['.nodegenrc', '.generate-itrc'];
    for (let i = 0; i < rcNames.length; i++) {
      if (fs.pathExistsSync(path.join(basePath, rcNames[i]))) {
        return rcNames[i];
      }
    }
    // else try the .js ext
    const rcJSNames = ['.nodegenrc.js', '.generate-itrc.js'];
    for (let i = 0; i < rcJSNames.length; i++) {
      if (fs.pathExistsSync(path.join(basePath, rcJSNames[i]))) {
        return rcJSNames[i];
      }
    }
    return false;
  }

  /**
   * Parses and validates a provided nodegenrc file
   * @param localNodegenPath
   * @return {{nodegenDir}|*}
   */
  public validate (localNodegenPath: string): NodegenRcInterface {
    let nodegenRcOject: any;
    try {
      nodegenRcOject = fs.readJsonSync(localNodegenPath);
    } catch (e) {
      // try to require the js file instead
      try {
        nodegenRcOject = require(localNodegenPath);
      } catch (e) {
        console.error(`Failed to parse ${localNodegenPath} file`, e);
        throw e;
      }
    }
    if (!nodegenRcOject.nodegenDir) {
      throw new Error('Missing .nodegenrc attribute: nodegenDir');
    }
    return nodegenRcOject;
  }
}

export default new NodegenRc();
