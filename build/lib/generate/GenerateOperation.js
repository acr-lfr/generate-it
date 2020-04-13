"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var lodash_1 = tslib_1.__importStar(require("lodash"));
var generateSubresourceName_1 = tslib_1.__importDefault(require("./generateSubresourceName"));
var path_1 = tslib_1.__importDefault(require("path"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var NamingUtils_1 = tslib_1.__importDefault(require("../helpers/NamingUtils"));
var TemplateRenderer_1 = tslib_1.__importDefault(require("../template/TemplateRenderer"));
var FileTypeCheck_1 = tslib_1.__importDefault(require("../FileTypeCheck"));
var GeneratedComparison_1 = tslib_1.__importDefault(require("./GeneratedComparison"));
var GenerateOperation = /** @class */ (function () {
    function GenerateOperation() {
    }
    /**
     * Groups all http verbs for each path to then generate each operation file
     */
    GenerateOperation.prototype.files = function (config, fileType) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var files, iteratable, filesKeys, i, operationNameItem, operation;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = {};
                        iteratable = config.data.swagger.paths || config.data.swagger.channels;
                        lodash_1.each(iteratable, function (pathProperties, pathName) {
                            var operationName = pathProperties.endpointName;
                            files[operationName] = files[operationName] || [];
                            pathName = pathName.replace(/}/g, '').replace(/{/g, ':');
                            files[operationName].push({
                                path_name: pathName,
                                path: pathProperties,
                                subresource: generateSubresourceName_1["default"](pathName, operationName)
                            });
                        });
                        filesKeys = Object.keys(files);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < filesKeys.length)) return [3 /*break*/, 4];
                        operationNameItem = filesKeys[i];
                        operation = files[operationNameItem];
                        return [4 /*yield*/, this.file(config, operation, operationNameItem, fileType)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, files];
                }
            });
        });
    };
    /**
     * Generate an operation file
     * @param config
     * @param operation
     * @param operationName
     * @param fileType
     * @param verbose
     * @param additionalTplContent
     */
    GenerateOperation.prototype.file = function (config, operation, operationName, fileType, verbose, additionalTplContent) {
        if (verbose === void 0) { verbose = false; }
        if (additionalTplContent === void 0) { additionalTplContent = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var filePath, data, subDir, ext, newFilename, targetFile, renderedContent;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path_1["default"].join(config.root, config.file_name);
                        data = fs_extra_1["default"].readFileSync(filePath, 'utf8');
                        subDir = config.root.replace(new RegExp(config.templates_dir + "[/]?"), '');
                        ext = NamingUtils_1["default"].getFileExt(config.file_name);
                        newFilename = NamingUtils_1["default"].fixRouteName(NamingUtils_1["default"].generateOperationSuffix(subDir, operationName, ext));
                        targetFile = path_1["default"].resolve(config.targetDir, subDir, newFilename);
                        renderedContent = TemplateRenderer_1["default"].load(data.toString(), this.templateVariables(operationName, operation, config, additionalTplContent, verbose, fileType), ext);
                        if (!(FileTypeCheck_1["default"].isStubFile(config.file_name) && fs_extra_1["default"].existsSync(targetFile))) return [3 /*break*/, 2];
                        return [4 /*yield*/, GeneratedComparison_1["default"].generateComparisonFile(targetFile, config.targetDir, subDir, newFilename, renderedContent)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, fs_extra_1["default"].writeFileSync(targetFile, renderedContent, 'utf8')];
                }
            });
        });
    };
    /**
     * Returns the template variables
     * @param operationName
     * @param operation
     * @param config
     * @param additionalTplContent
     * @param verbose
     * @param fileType
     */
    GenerateOperation.prototype.templateVariables = function (operationName, operation, config, additionalTplContent, verbose, fileType) {
        if (additionalTplContent === void 0) { additionalTplContent = {}; }
        if (verbose === void 0) { verbose = false; }
        return tslib_1.__assign({ operation_name: lodash_1["default"].camelCase(operationName.replace(/[}{]/g, '')), fileType: fileType,
            config: config, operations: operation, swagger: config.data.swagger, mockServer: config.mockServer || false, verbose: verbose }, additionalTplContent);
    };
    return GenerateOperation;
}());
exports["default"] = new GenerateOperation();
