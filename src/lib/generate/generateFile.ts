import GenerateOperationFileConfig from '@/interfaces/GenerateOperationFileConfig';
import NamingUtils from '@/lib/helpers/NamingUtils';
import TemplateRenderer from '@/lib/template/TemplateRenderer';
import fs from 'fs-extra';
import * as _ from 'lodash';
import path from 'path';
import generateFileDoWrite from '@/lib/generate/generateFileDoWrite';

/**
 * Generates a file.
 *
 * @private
 * @param  {GenerateOperationFileConfig} config
 * @param  {Boolean} isFirstRun
 * @param  {Object} [additionalTplObject]  An additional object that will be passed to the tpl, defaults to an empty object
 * @param  {string }nodegenDir
 * @return {Promise}
 */
export default (config: GenerateOperationFileConfig, isFirstRun: boolean, additionalTplObject: any = {}, nodegenDir: string) => {
  const templatesDir = config.templates_dir;
  const targetDir = config.targetDir;
  const fileName = config.file_name;
  const root = config.root;

  // const data = config.data
  const loadFilePath = (fileName !== 'package.json.njk') ?
    path.resolve(root, fileName) :
    path.resolve(process.cwd(), 'package.json');

  const templatePath = path.resolve(targetDir, path.relative(templatesDir, path.resolve(root, fileName)));

  // should write or not
  if (!generateFileDoWrite(isFirstRun, templatePath, root, nodegenDir)) {
    return;
  }

  // This could be a new file in the templates, ensure the dir structure is present before preceding
  fs.ensureFileSync(templatePath);
  global.veryVerboseLogging('Parsing/placing file: ' + templatePath);

  const content = fs.readFileSync(loadFilePath, 'utf8');

  const renderedContent = TemplateRenderer.load(content, {
    package: config.package,
    swagger: config.data.swagger,
    endpoints: config.data.swagger.endpoints,
    definitions: config.data.swagger.definitions ? Object.keys(config.data.swagger.definitions) : [],
    additionalTplObject,
    nodegenRc: config.data.nodegenRc
  });

  const generatedPath = path.resolve(
    targetDir,
    path.relative(templatesDir, path.resolve(root, NamingUtils.stripNjkExtension(fileName))),
  );

  return fs.writeFileSync(generatedPath, renderedContent, 'utf8');
};
