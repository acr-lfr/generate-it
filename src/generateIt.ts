import '@colors/colors';
import * as fs from 'fs-extra';
import path from 'path';
import globalHelpers from '@/lib/helpers/globalHelpers';
import { Config } from '@/interfaces/Config';
import ConfigMerger from '@/lib/ConfigMerger';
import FileIterator from '@/lib/FileIterator';
import GeneratedComparison from '@/lib/generate/GeneratedComparison';
import generateDirectoryStructure from '@/lib/generate/generateDirectoryStructure';
import TemplateFetch from '@/lib/template/TemplateFetch';
import OpenAPIBundler from '@/lib/openapi/OpenAPIBundler';
import checkRcOpIdArrIsValid from '@/lib/helpers/checkRcOpIdArrIsValid';
import Injections from '@/lib/Injections';

/**
 * Generates a code skeleton for an API given an OpenAPI/Swagger file.
 * @return {Promise}
 */
export default async (config: Config): Promise<boolean> => {
  globalHelpers(config.verbose, config.veryVerbose);

  const templatesDir = await TemplateFetch.resolveTemplateType( config.template, config.targetDir, config.dontUpdateTplCache);
  let extendedConfig = await ConfigMerger.base(config, templatesDir);

  extendedConfig.templates = await Injections.init(extendedConfig);

  const apiObject = await OpenAPIBundler.bundle(config.swaggerFilePath, extendedConfig);

  const baseCompiledObjectPath = path.join(GeneratedComparison.getCacheBaseDir(config.targetDir), 'apiObject.json');
  fs.ensureFileSync(baseCompiledObjectPath);
  fs.writeJsonSync(baseCompiledObjectPath, apiObject, {spaces: 2});
  extendedConfig = ConfigMerger.injectSwagger(extendedConfig, apiObject);
  checkRcOpIdArrIsValid(extendedConfig.swagger, extendedConfig.nodegenRc);

  await FileIterator.walk(
    await generateDirectoryStructure(extendedConfig, templatesDir),
    extendedConfig
  );

  if (!config.dontRunComparisonTool) {
    const diffObject = await GeneratedComparison.fileDiffs(config.targetDir);
    GeneratedComparison.fileDiffsPrint(config.targetDir, diffObject);
    GeneratedComparison.versionCleanup(config.targetDir);
  }

  const changelogFilePath = path.join(config.targetDir, 'changelog.generate-it.json');
  if (fs.existsSync(changelogFilePath)) {
    const changelog = fs.readJsonSync(changelogFilePath);
    const latest = changelog.releases.pop();
    console.log('  ');
    console.log('  ');
    console.log('Template version: '.green + latest.templateVersion.green.bold);
    console.log('Minimum generate-it core version: ' + latest.minCoreVersion.bold);
    console.log('Tpl Change Description: ' + latest.description.bold);
    console.log('  ');
    console.log('  ');
    console.log('Complete'.green.bold);
    console.log('  ');
    console.log('See the changelog for details: '.green.bold + changelogFilePath.green);
  } else {
    console.log('Completed'.green.bold);
  }

  return true;
};
