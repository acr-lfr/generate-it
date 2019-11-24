"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const path_1 = tslib_1.__importDefault(require("path"));
const prettier_1 = tslib_1.__importDefault(require("prettier"));
const FileTypeCheck_1 = tslib_1.__importDefault(require("./FileTypeCheck"));
const GeneratedComparison_1 = tslib_1.__importDefault(require("./GeneratedComparison"));
const NamingUtils_1 = tslib_1.__importDefault(require("./helpers/NamingUtils"));
const TemplateRenderer_1 = tslib_1.__importDefault(require("./TemplateRenderer"));
/**
 * Generates a file for every operation.
 *
 * @param config
 * @param operation
 * @param operationName
 * @param verbose
 * @param additionalTplContent
 * @returns {Promise}
 */
exports.default = (config, operation, operationName, verbose = false, additionalTplContent = {}) => {
    return new Promise((resolve, reject) => {
        const filePath = path_1.default.join(config.root, config.file_name);
        fs_extra_1.default.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            const subDir = config.root.replace(new RegExp(`${config.templates_dir}[/]?`), '');
            const ext = NamingUtils_1.default.getFileExt(config.file_name);
            const newFilename = NamingUtils_1.default.fixRouteName(NamingUtils_1.default.generateOperationSuffix(subDir, operationName, ext));
            const targetFile = path_1.default.resolve(config.targetDir, subDir, newFilename);
            const tplVars = Object.assign({ operation_name: lodash_1.default.camelCase(operationName.replace(/[}{]/g, '')), operations: operation, swagger: config.data.swagger, mockServer: config.mockServer || false, verbose }, additionalTplContent);
            const renderedContent = TemplateRenderer_1.default.load(data.toString(), tplVars);
            const replacedCharacters = renderedContent.replace(new RegExp('&' + '#' + 'x27;', 'g'), '\'');
            const prettyContent = prettier_1.default.format(replacedCharacters, {
                bracketSpacing: true,
                endOfLine: 'auto',
                semi: true,
                singleQuote: true,
                parser: ext === 'ts' ? 'typescript' : 'babel',
            });
            const moduleType = subDir.substring(subDir.lastIndexOf('/') + 1);
            if (config.data.ignoredModules && config.data.ignoredModules.includes(moduleType)) {
                return reject('Module ignored: ' + moduleType);
            }
            if (FileTypeCheck_1.default.isStubFile(config.file_name) && fs_extra_1.default.existsSync(targetFile)) {
                GeneratedComparison_1.default.generateComparisonFile(targetFile, config.targetDir, subDir, newFilename, prettyContent)
                    .then(resolve)
                    .catch(reject);
            }
            else {
                fs_extra_1.default.writeFileSync(targetFile, prettyContent, 'utf8');
                return resolve();
            }
        });
    });
};
