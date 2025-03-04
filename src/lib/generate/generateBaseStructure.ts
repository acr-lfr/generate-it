import * as fs from 'fs-extra';
import path from 'path';
import { mergePackageJsonFiles } from '@/lib/helpers/mergePackageJsonFiles';
import { ConfigExtendedBase } from '@/interfaces';
import shouldCopyOrRenderFile from '@/lib/helpers/shouldCopyOrRenderFile';

/**
 * Creates the base structure
 * @param targetDir
 * @param templatesDir
 * @param config
 * @return void
 */
export default (targetDir: string, templatesDir: string, config: ConfigExtendedBase) => {
  const additionalOptionsToInject = {
    mockingServer: config.mockServer,
  };
  fs.mkdirsSync(targetDir);
  const callerPackageJsonPath = path.join(targetDir, 'package.json');
  const packageJsonFound = fs.existsSync(callerPackageJsonPath);
  fs.copySync(templatesDir, targetDir, {
    filter: (src) => {
      if (src.indexOf('__mocks__') !== -1 && !additionalOptionsToInject.mockingServer) {
        return false;
      }
      if (src.endsWith('.git')) {
        return false;
      }
      if (packageJsonFound) {
        if (src.indexOf('package.json') !== -1) {
          return false;
        }
      }
      const dir = src.substring(0, src.lastIndexOf(path.sep));
      const file = src.substr(src.lastIndexOf(path.sep) + 1);

      return shouldCopyOrRenderFile({
        directoryPathContainingFilename: dir,
        filenameBeingProcessed: file,
        ignoreForWhichAction: 'copy',
        nodegenRc: config.nodegenRc
      });
    },
  });

  if (!packageJsonFound) {
    return;
  }

  // merge the package json files together
  const callerPackageJson = fs.readJsonSync(callerPackageJsonPath);
  let tplPackageJsonPath = path.join(templatesDir, 'package.json.njk');

  if (!fs.pathExistsSync(tplPackageJsonPath)) {
    tplPackageJsonPath = path.join(templatesDir, 'package.json');
    if (!fs.pathExistsSync(tplPackageJsonPath)) {
      return;
    }
  }

  const templatePackageJson = JSON.parse(fs.readFileSync(tplPackageJsonPath, 'utf8'));

  const merged = mergePackageJsonFiles(callerPackageJson, templatePackageJson, additionalOptionsToInject);
  fs.writeJsonSync(callerPackageJsonPath, merged, {
    spaces: 2,
  });
};
