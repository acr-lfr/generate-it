"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var path_1 = tslib_1.__importDefault(require("path"));
var prettier_1 = tslib_1.__importDefault(require("prettier"));
var FileTypeCheck_1 = tslib_1.__importDefault(require("../FileTypeCheck"));
var GeneratedComparison_1 = tslib_1.__importDefault(require("./GeneratedComparison"));
var NamingUtils_1 = tslib_1.__importDefault(require("../helpers/NamingUtils"));
var TemplateRenderer_1 = tslib_1.__importDefault(require("../template/TemplateRenderer"));
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
exports["default"] = (function (config, operation, operationName, verbose, additionalTplContent) {
    if (verbose === void 0) { verbose = false; }
    if (additionalTplContent === void 0) { additionalTplContent = {}; }
    return new Promise(function (resolve, reject) {
        var filePath = path_1["default"].join(config.root, config.file_name);
        fs_extra_1["default"].readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                return reject(err);
            }
            var subDir = config.root.replace(new RegExp(config.templates_dir + "[/]?"), '');
            var ext = NamingUtils_1["default"].getFileExt(config.file_name);
            var newFilename = NamingUtils_1["default"].fixRouteName(NamingUtils_1["default"].generateOperationSuffix(subDir, operationName, ext));
            var targetFile = path_1["default"].resolve(config.targetDir, subDir, newFilename);
            var tplVars = tslib_1.__assign({ operation_name: lodash_1["default"].camelCase(operationName.replace(/[}{]/g, '')), operations: operation, swagger: config.data.swagger, mockServer: config.mockServer || false, verbose: verbose }, additionalTplContent);
            var renderedContent = TemplateRenderer_1["default"].load(data.toString(), tplVars);
            var replacedCharacters = renderedContent.replace(new RegExp('&' + '#' + 'x27;', 'g'), '\'');
            var prettyContent = prettier_1["default"].format(replacedCharacters, {
                bracketSpacing: true,
                endOfLine: 'auto',
                semi: true,
                singleQuote: true,
                parser: ext === 'ts' ? 'typescript' : 'babel'
            });
            var moduleType = subDir.substring(subDir.lastIndexOf('/') + 1);
            if (config.data.ignoredModules && config.data.ignoredModules.includes(moduleType)) {
                return reject('Module ignored: ' + moduleType);
            }
            if (FileTypeCheck_1["default"].isStubFile(config.file_name) && fs_extra_1["default"].existsSync(targetFile)) {
                GeneratedComparison_1["default"].generateComparisonFile(targetFile, config.targetDir, subDir, newFilename, prettyContent)
                    .then(resolve)["catch"](reject);
            }
            else {
                fs_extra_1["default"].writeFileSync(targetFile, prettyContent, 'utf8');
                return resolve();
            }
        });
    });
});
