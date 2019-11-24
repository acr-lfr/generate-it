"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const NamingUtils_1 = tslib_1.__importDefault(require("./helpers/NamingUtils"));
const TemplateRenderer_1 = tslib_1.__importDefault(require("./TemplateRenderer"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const _ = tslib_1.__importStar(require("lodash"));
const path_1 = tslib_1.__importDefault(require("path"));
/**
 * Generates a file.
 *
 * @private
 * @param  {Object} config
 * @param  {String} config.templates_dir Directory where the templates live.
 * @param  {String} config.targetDir     Directory where the file will be generated.
 * @param  {String} config.file_name     Name of the generated file.
 * @param  {String} config.root          Root directory.
 * @param  {Object} config.data          Data to pass to the template.
 * @param  {Boolean} isFirstRun
 * @param  {Object} [additionalTplObject]  An additional object that will be passed to the tpl, defaults to an empty object
 * @return {Promise}
 */
exports.default = (config, isFirstRun, additionalTplObject = {}) => {
    return new Promise((resolve, reject) => {
        const templatesDir = config.templates_dir;
        const targetDir = config.targetDir;
        const fileName = config.file_name;
        const root = config.root;
        // const data = config.data
        const loadFilePath = (fileName !== 'package.json.njk') ? path_1.default.resolve(root, fileName) : path_1.default.resolve(process.cwd(), 'package.json');
        const templatePath = path_1.default.resolve(targetDir, path_1.default.relative(templatesDir, path_1.default.resolve(root, fileName)));
        // should write or not
        if (isFirstRun || !fs_extra_1.default.existsSync(NamingUtils_1.default.stripNjkExtension(templatePath)) || root.includes('/http/nodegen')) {
            // This could be a new file in the templates, ensure the dir structure is present before preceding
            fs_extra_1.default.ensureFileSync(templatePath);
            global.veryVerboseLogging('Parsing/placing file: ' + templatePath);
            fs_extra_1.default.readFile(loadFilePath, 'utf8', (err, content) => {
                if (err) {
                    return reject(err);
                }
                try {
                    const endpoints = [];
                    if (fileName.startsWith('routesImporter')) {
                        _.each(config.data.swagger.paths, (operationPath, pathName) => {
                            let operationName;
                            const segments = pathName.split('/').filter((s) => s && s.trim() !== '');
                            if (segments.length > config.segmentsCount) {
                                segments.splice(config.segmentsCount);
                                operationName = segments.join(' ').toLowerCase().replace(/[^a-zA-Z0-9-]+(.)/g, (m, chr) => chr.toUpperCase());
                            }
                            else {
                                operationName = operationPath.endpointName;
                            }
                            if (!endpoints.includes(operationName)) {
                                endpoints.push(operationName);
                            }
                        });
                    }
                    const template = TemplateRenderer_1.default.load(content, {
                        package: config.package,
                        swagger: config.data.swagger,
                        definitions: Object.keys(config.data.swagger.definitions),
                        endpoints,
                        additionalTplObject,
                    });
                    const parsedContent = template.replace(new RegExp('&' + '#' + 'x27;', 'g'), '\'');
                    const generatedPath = path_1.default.resolve(targetDir, path_1.default.relative(templatesDir, path_1.default.resolve(root, NamingUtils_1.default.stripNjkExtension(fileName))));
                    fs_extra_1.default.writeFile(generatedPath, parsedContent, 'utf8', (wfErr) => {
                        if (wfErr) {
                            return reject(wfErr);
                        }
                        resolve();
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        else {
            resolve();
        }
    });
};
//# sourceMappingURL=generateFile.js.map