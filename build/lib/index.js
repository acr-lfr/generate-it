"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
require("colors");
var fs = tslib_1.__importStar(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var ConfigMerger_1 = tslib_1.__importDefault(require("./ConfigMerger"));
var FileIterator_1 = tslib_1.__importDefault(require("./FileIterator"));
var GeneratedComparison_1 = tslib_1.__importDefault(require("./GeneratedComparison"));
var generateDirectoryStructure_1 = tslib_1.__importDefault(require("./generateDirectoryStructure"));
var TemplateFetch_1 = tslib_1.__importDefault(require("./TemplateFetch"));
var OpenAPIBundler_1 = tslib_1.__importDefault(require("./OpenAPIBundler"));
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
exports["default"] = (function (config) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var templatesDir, extendedConfig, apiObject, baseCompiledObjectPath, diffObject;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Preparing templates...'.green.bold);
                return [4 /*yield*/, TemplateFetch_1["default"].resolveTemplateType(config.template, config.targetDir, config.dontUpdateTplCache)];
            case 1:
                templatesDir = _a.sent();
                return [4 /*yield*/, ConfigMerger_1["default"].base(config, templatesDir)];
            case 2:
                extendedConfig = _a.sent();
                console.log('Preparing openapi object...'.green.bold);
                return [4 /*yield*/, OpenAPIBundler_1["default"].bundle(config.swaggerFilePath, config)];
            case 3:
                apiObject = _a.sent();
                baseCompiledObjectPath = path_1["default"].join(GeneratedComparison_1["default"].getCacheBaseDir(config.targetDir), 'apiObject.json');
                console.log(("Printing full object to: " + baseCompiledObjectPath).green.bold);
                fs.ensureFileSync(baseCompiledObjectPath);
                fs.writeJsonSync(baseCompiledObjectPath, apiObject, { spaces: 2 });
                extendedConfig = ConfigMerger_1["default"].injectSwagger(extendedConfig, apiObject);
                console.log('Injecting content to files...'.green.bold);
                return [4 /*yield*/, FileIterator_1["default"].walk(generateDirectoryStructure_1["default"](extendedConfig, templatesDir), extendedConfig)];
            case 4:
                _a.sent();
                console.log('Building stub file comparison list...'.green.bold);
                return [4 /*yield*/, GeneratedComparison_1["default"].fileDiffs(config.targetDir)];
            case 5:
                diffObject = _a.sent();
                return [4 /*yield*/, GeneratedComparison_1["default"].fileDiffsPrint(config.targetDir, diffObject)];
            case 6:
                _a.sent();
                console.log('Comparison version cleanup...'.green.bold);
                GeneratedComparison_1["default"].versionCleanup(config.targetDir);
                return [2 /*return*/];
        }
    });
}); });
