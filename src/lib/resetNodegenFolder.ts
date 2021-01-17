import { NodegenRc } from '@/interfaces/NodegenRc';
import * as fs from 'fs-extra';
import path from 'path';

/**
 *
 * @param {string} targetDir
 * @param {string} templatesDir
 * @param {boolean} mocked
 * @param nodegenRc
 */
export default (targetDir: string, templatesDir: string, mocked: boolean = false, nodegenRc: NodegenRc) => {
  const nodeGenDir = nodegenRc.nodegenDir;
  const copyFilter = {
    filter: (src: any) => {
      // ensure the njk files are not copied over
      return (src.indexOf('.njk') === -1);
    },
  };
  fs.removeSync(path.join(targetDir, nodeGenDir));

  // always remove the changelog and pick up the new version from the downloaded
  const changelogFilePath = path.join(targetDir, 'changelog.generate-it.json');
  if (fs.existsSync(changelogFilePath)) {
    fs.removeSync(changelogFilePath);
  }

  fs.copySync(
    path.join(templatesDir, nodeGenDir),
    path.join(targetDir, nodeGenDir),
    copyFilter,
  );
  if (mocked) {
    const mocksDir = nodegenRc.nodegenMockDir;
    fs.removeSync(path.join(targetDir, mocksDir));
    fs.copySync(
      path.join(templatesDir, mocksDir),
      path.join(targetDir, mocksDir),
      copyFilter,
    );
  }
};
