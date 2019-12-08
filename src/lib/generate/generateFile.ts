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
  return new Promise((resolve, reject) => {
    const templatesDir = config.templates_dir;
    const targetDir = config.targetDir;
    const fileName = config.file_name;
    const root = config.root;

    // const data = config.data
    const loadFilePath = (fileName !== 'package.json.njk') ? path.resolve(root, fileName) : path.resolve(process.cwd(), 'package.json');
    const templatePath = path.resolve(targetDir, path.relative(templatesDir, path.resolve(root, fileName)));

    // should write or not
    if (isFirstRun || !fs.existsSync(NamingUtils.stripNjkExtension(templatePath)) || root.includes('/http/nodegen')) {
      // This could be a new file in the templates, ensure the dir structure is present before preceding
      fs.ensureFileSync(templatePath);
      global.veryVerboseLogging('Parsing/placing file: ' + templatePath);
      fs.readFile(loadFilePath, 'utf8', (err, content) => {
        if (err) {
          return reject(err);
        }
        try {
          const endpoints: string[] = [];
          if (fileName.startsWith('routesImporter')) {
            _.each(config.data.swagger.paths, (operationPath, pathName) => {
              let operationName;
              const segments = pathName.split('/').filter((s) => s && s.trim() !== '');
              if (segments.length > config.segmentsCount) {
                segments.splice(config.segmentsCount);
                operationName = segments.join(' ').toLowerCase().replace(/[^a-zA-Z0-9-]+(.)/g, (m, chr) => chr.toUpperCase());
              } else {
                operationName = operationPath.endpointName;
              }
              if (!endpoints.includes(operationName)) {
                endpoints.push(operationName);
              }
            });
          }
          const template = TemplateRenderer.load(content, {
            package: config.package,
            swagger: config.data.swagger,
            definitions: Object.keys(config.data.swagger.definitions),
            endpoints,
            additionalTplObject,
          });
          const parsedContent = template.replace(new RegExp('&' + '#' + 'x27;', 'g'), '\'');
          const generatedPath = path.resolve(
            targetDir,
            path.relative(templatesDir, path.resolve(root, NamingUtils.stripNjkExtension(fileName))),
          );
          fs.writeFile(generatedPath, parsedContent, 'utf8', (wfErr) => {
            if (wfErr) {
              return reject(wfErr);
            }
            resolve();
          });
        } catch (e) {
          reject(e);
        }
      });
    } else {
      resolve();
    }
  });
};
