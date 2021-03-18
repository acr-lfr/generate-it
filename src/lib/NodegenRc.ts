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
    const fullRcPath = this.checkWhichExists(targetDir);

    if (fullRcPath) {
      return this.validate(fullRcPath.path);
    } else {
      const tplRcFilePath = this.checkWhichExists(tplDir);
      if (!tplRcFilePath) {
        throw new Error('The tpl directory you are trying to use does not have a .nodegenrc file. Aborting the process.');
      }
      const localPath = path.join(targetDir, tplRcFilePath.filename);
      fs.copySync(tplRcFilePath.path, localPath);
      return this.validate(localPath);
    }
  }

  checkWhichExists (basePath: string): { path: string, filename: string } | false {
    const rcNames = [
      // original rc files containing json
      '.nodegenrc',
      '.gen-itrc',

      // rc .json files containing json
      '.nodegenrc.json',
      '.gen-itrc.json',

      // js files exporting a default common js module containing the required js object
      '.nodegenrc.js',
      '.gen-itrc.js',
      '.nodegen.js',
      '.gen-it.js',
    ];
    for (let i = 0; i < rcNames.length; i++) {
      const fullRcPath = path.join(basePath, rcNames[i]);
      if (fs.pathExistsSync(fullRcPath)) {
        return {
          filename: rcNames[i],
          path: fullRcPath
        };
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
