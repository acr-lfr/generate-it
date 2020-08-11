"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
require("colors");
var fs = tslib_1.__importStar(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var globalHelpers_1 = tslib_1.__importDefault(require("./lib/helpers/globalHelpers"));
var ConfigMerger_1 = tslib_1.__importDefault(require("./lib/ConfigMerger"));
var FileIterator_1 = tslib_1.__importDefault(require("./lib/FileIterator"));
var GeneratedComparison_1 = tslib_1.__importDefault(require("./lib/generate/GeneratedComparison"));
var generateDirectoryStructure_1 = tslib_1.__importDefault(require("./lib/generate/generateDirectoryStructure"));
var TemplateFetch_1 = tslib_1.__importDefault(require("./lib/template/TemplateFetch"));
var OpenAPIBundler_1 = tslib_1.__importDefault(require("./lib/openapi/OpenAPIBundler"));
var logTimeDiff_1 = tslib_1.__importDefault(require("./lib/helpers/logTimeDiff"));
var checkRcOpIdArrIsValid_1 = tslib_1.__importDefault(require("./lib/helpers/checkRcOpIdArrIsValid"));
/**
 * Generates a code skeleton for an API given an OpenAPI/Swagger file.
 * @return {Promise}
 */
exports["default"] = (function (config) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var startTime, templatesDir, extendedConfig, apiObject, baseCompiledObjectPath, diffObject;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logTimeDiff_1["default"](0, 0);
                startTime = new Date().getTime();
                globalHelpers_1["default"](config.verbose, config.veryVerbose);
                console.log('Fetching templates...'.green.bold);
                return [4 /*yield*/, TemplateFetch_1["default"].resolveTemplateType(config.template, config.targetDir, config.dontUpdateTplCache)];
            case 1:
                templatesDir = _a.sent();
                return [4 /*yield*/, ConfigMerger_1["default"].base(config, templatesDir)];
            case 2:
                extendedConfig = _a.sent();
                logTimeDiff_1["default"](startTime, (new Date()).getTime(), true);
                console.log('Preparing openapi object...'.green.bold);
                return [4 /*yield*/, OpenAPIBundler_1["default"].bundle(config.swaggerFilePath, extendedConfig)];
            case 3:
                apiObject = _a.sent();
                logTimeDiff_1["default"](startTime, (new Date()).getTime(), true);
                console.log("Printing full object to the .openapi-nodegen directory".green.bold);
                baseCompiledObjectPath = path_1["default"].join(GeneratedComparison_1["default"].getCacheBaseDir(config.targetDir), 'apiObject.json');
                fs.ensureFileSync(baseCompiledObjectPath);
                fs.writeJsonSync(baseCompiledObjectPath, apiObject, { spaces: 2 });
                extendedConfig = ConfigMerger_1["default"].injectSwagger(extendedConfig, apiObject);
                checkRcOpIdArrIsValid_1["default"](extendedConfig.swagger, extendedConfig.nodegenRc);
                logTimeDiff_1["default"](startTime, (new Date()).getTime(), true);
                console.log('Injecting content to files...'.green.bold);
                return [4 /*yield*/, FileIterator_1["default"].walk(generateDirectoryStructure_1["default"](extendedConfig, templatesDir), extendedConfig)];
            case 4:
                _a.sent();
                logTimeDiff_1["default"](startTime, (new Date()).getTime(), true);
                if (!!config.dontRunComparisonTool) return [3 /*break*/, 7];
                console.log('Building stub file comparison list...'.green.bold);
                return [4 /*yield*/, GeneratedComparison_1["default"].fileDiffs(config.targetDir)];
            case 5:
                diffObject = _a.sent();
                return [4 /*yield*/, GeneratedComparison_1["default"].fileDiffsPrint(config.targetDir, diffObject)];
            case 6:
                _a.sent();
                logTimeDiff_1["default"](startTime, (new Date()).getTime(), true);
                console.log('Comparison version cleanup...'.green.bold);
                GeneratedComparison_1["default"].versionCleanup(config.targetDir);
                logTimeDiff_1["default"](startTime, (new Date()).getTime(), true);
                _a.label = 7;
            case 7:
                console.log('Complete'.green.bold);
                return [2 /*return*/, true];
        }
    });
}); });
