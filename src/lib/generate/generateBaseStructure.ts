import deepmerge from 'deepmerge';
import * as fs from 'fs-extra';
import path from 'path';
import { mergePackageJsonFiles } from '@/lib/helpers/mergePackageJsonFiles';

/**
 * Creates the base structure
 * @param targetDir
 * @param templatesDir
 * @param additionalOptionsToInject
 * @return void
 */
export default (targetDir: string, templatesDir: string, additionalOptionsToInject: any) => {
  additionalOptionsToInject = additionalOptionsToInject || {};
  fs.mkdirsSync(targetDir);
  const callerPackageJsonPath = path.join(targetDir, 'package.json');
  const packageJsonFound = (fs.existsSync(callerPackageJsonPath));
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
      return true;
    },
  });

  if (packageJsonFound) {
    // merge the package json files together
    const callerPackageJson = fs.readJsonSync(callerPackageJsonPath);
    let tplPackageJsonPath = path.join(templatesDir, 'package.json.njk');
    if (!fs.pathExistsSync(tplPackageJsonPath)) {
      tplPackageJsonPath = path.join(templatesDir, 'package.json');
    }

    const templatePackageJson = JSON.parse(fs.readFileSync(tplPackageJsonPath, 'utf8'));

    const merged = mergePackageJsonFiles(
      callerPackageJson,
      templatePackageJson,
      additionalOptionsToInject
    );
    fs.writeJsonSync(
      callerPackageJsonPath,
      merged,
      {
        spaces: 2,
      },
    );
  }
};
