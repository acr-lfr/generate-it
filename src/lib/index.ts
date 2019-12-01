import 'colors';
import * as fs from 'fs-extra';
import path from 'path';

import Config from '@/interfaces/Config';
import ConfigMerger from '@/lib/ConfigMerger';
import FileIterator from '@/lib/FileIterator';
import GeneratedComparison from '@/lib/GeneratedComparison';
import generateDirectoryStructure from '@/lib/generateDirectoryStructure';
import TemplateFetch from '@/lib/TemplateFetch';
import OpenAPIBundler from '@/lib/OpenAPIBundler';

/**
 * Generates a code skeleton for an API given an OpenAPI/Swagger file.
 *
 * @module codegen.generate
 * @param  {Object} config Configuration options
 * @param  {String} config.swaggerFilePath - OpenAPI file path
 * @param  {String} config.targetDir Path to the directory where the files will be generated.
 * @param  {String} config.template - Templates to use, es6 or typescript
 * @param  {String} config.handlebars_helper - Additional custom helper files to loads
 * @param  {Boolean} config.mockServer - Dictates if mocker server is generated or not, this overwrites all files in target
 * @param  {Boolean} config.verbose - Verbose logging on or off
 * @return {Promise}
 */
export default async (config: Config) => {
  console.log('Preparing templates...'.green.bold);
  const templatesDir = await TemplateFetch.resolveTemplateType(config.template, config.targetDir, config.dontUpdateTplCache);
  let extendedConfig = await ConfigMerger.base(config, templatesDir);

  console.log('Preparing openapi object...'.green.bold);
  const apiObject = await OpenAPIBundler.bundle(config.swaggerFilePath, config);
  const baseCompiledObjectPath = path.join(GeneratedComparison.getCacheBaseDir(config.targetDir), 'apiObject.json');

  console.log(`Printing full object to: ${baseCompiledObjectPath}`.green.bold);
  fs.ensureFileSync(baseCompiledObjectPath);
  fs.writeJsonSync(baseCompiledObjectPath, apiObject, {spaces: 2});
  extendedConfig = ConfigMerger.injectSwagger(extendedConfig, apiObject);

  console.log('Injecting content to files...'.green.bold);
  await FileIterator.walk(generateDirectoryStructure(extendedConfig, templatesDir), extendedConfig);

  console.log('Building stub file comparison list...'.green.bold);
  const diffObject = await GeneratedComparison.fileDiffs(config.targetDir);
  await GeneratedComparison.fileDiffsPrint(config.targetDir, diffObject);

  console.log('Comparison version cleanup...'.green.bold);
  GeneratedComparison.versionCleanup(config.targetDir);
};
