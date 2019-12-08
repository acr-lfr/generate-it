import GenerateOperationFileConfig from '@/interfaces/GenerateOperationFileConfig';
import NamingUtils from '@/lib/helpers/NamingUtils';
import TemplateRenderer from '@/lib/template/TemplateRenderer';
import fs from 'fs-extra';
import * as _ from 'lodash';
import path from 'path';

/**
 * Generates a file.
 *
 * @private
 * @param  {Object} config
 * @param  {String} config.templates_dir Directory where the templates live.
 * @param  {String} config.targetDir     Directory where the file will be generated.
 * @param  {String} config.file_name     Name of the generated file.
 * @param  {String} config.root          Root directory.
 * @param  {Object} config.data          Data to pass to the helpers.
 * @param  {Boolean} isFirstRun
 * @param  {Object} [additionalTplObject]  An additional object that will be passed to the tpl, defaults to an empty object
 * @return {Promise}
 */
export default (config: GenerateOperationFileConfig, isFirstRun: boolean, additionalTplObject: any = {}) => {

  const templatesDir = config.templates_dir;
  const targetDir = config.targetDir;
  const fileName = config.file_name;
  const root = config.root;

  // const data = config.data
  const loadFilePath = (fileName !== 'package.json.njk') ? path.resolve(root, fileName) : path.resolve(process.cwd(), 'package.json');
  const templatePath = path.resolve(targetDir, path.relative(templatesDir, path.resolve(root, fileName)));

  // should write or not
  if (!isFirstRun || fs.existsSync(NamingUtils.stripNjkExtension(templatePath)) || !root.includes('/http/nodegen')) {
    return;
  }
  // This could be a new file in the templates, ensure the dir structure is present before preceding
  fs.ensureFileSync(templatePath);
  global.veryVerboseLogging('Parsing/placing file: ' + templatePath);
  const content = fs.readFileSync(loadFilePath, 'utf8');
  const endpoints: string[] = [];
  if (fileName.startsWith('routesImporter')) {
    _.each(config.data.swagger.paths, (operationPath) => {
      const operationName = operationPath.endpointName;
      if (!endpoints.includes(operationName)) {
        endpoints.push(operationName);
      }
    });
  }
  const renderedContent = TemplateRenderer.load(content, {
    package: config.package,
    swagger: config.data.swagger,
    definitions: Object.keys(config.data.swagger.definitions),
    endpoints,
    additionalTplObject,
  });
  const generatedPath = path.resolve(
    targetDir,
    path.relative(templatesDir, path.resolve(root, NamingUtils.stripNjkExtension(fileName))),
  );
  return fs.writeFileSync(generatedPath, renderedContent, 'utf8');
};
