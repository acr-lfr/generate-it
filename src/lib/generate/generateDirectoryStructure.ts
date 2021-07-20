import { ConfigExtendedBase } from '@/interfaces/ConfigExtendedBase';
import DisplayDependencyDiffs from '@/lib/diff/DisplayDependencyDiffs';
import generateBaseStructure from '@/lib/generate/generateBaseStructure';
import resetNodegenFolder from '@/lib/resetNodegenFolder';
import 'colors';
import fs from 'fs-extra';
import path from 'path';

/**
 * Generates the directory structure.
 * @param  {Object}        config - Configuration options
 * @param  {Object|String} config.swagger - Swagger JSON or a string pointing to a Swagger file.
 * @param  {String}        config.targetDir - Absolute path to the directory where the files will be rabbitMQ.
 * @param  {String}        config.templates - Absolute path to the templates that should be used.
 * @param  {Object}        config.nodegenRc - Absolute path to the templates that should be used.
 * @param  {String}        templatesDir - The absolute path the templates directory
 * @return {boolean}
 */
export default async (config: ConfigExtendedBase, templatesDir: string): Promise<boolean> => {
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
    await DisplayDependencyDiffs.check(targetDir, templatesDir, config.updateDependenciesFromTpl);
  }
  console.log('Nodegen directory structure ready');
  return IS_FIRST_RUN;
};
