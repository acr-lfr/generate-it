import ConfigExtendedBase from '@/interfaces/ConfigExtendedBase';
import displayDependencyDiffs from '@/lib/diff/displayDependencyDiffs';
import generateBaseStructure from '@/lib/generate/generateBaseStructure';
import resetNodegenFolder from '@/lib/resetNodegenFolder';
import 'colors';
import fs from 'fs-extra';
import path from 'path';

/**
 * Generates the directory structure.
 * @param  {Object}        config - Configuration options
 * @param  {Object|String} config.swagger - Swagger JSON or a string pointing to a Swagger file.
 * @param  {String}        config.targetDir - Absolute path to the directory where the files will be generated.
 * @param  {String}        config.templates - Absolute path to the templates that should be used.
 * @param  {Object}        config.nodegenRc - Absolute path to the templates that should be used.
 * @param  {String}        templatesDir - The absolute path the templates directory
 * @return {boolean}
 */
export default (config: ConfigExtendedBase, templatesDir: string) => {
  const targetDir = config.targetDir;
  let IS_FIRST_RUN = false;
  if (!fs.existsSync(path.join(targetDir, config.nodegenRc.nodegenDir))) {
    IS_FIRST_RUN = true;
    generateBaseStructure(
      targetDir,
      templatesDir,
      (config.mockServer) ? {mockingServer: true} : {});
  } else {
    resetNodegenFolder(targetDir, templatesDir, config.mockServer, config.nodegenRc);
    displayDependencyDiffs(targetDir, templatesDir);
  }
  console.log('Nodegen directory structure ready');
  return IS_FIRST_RUN;
};
