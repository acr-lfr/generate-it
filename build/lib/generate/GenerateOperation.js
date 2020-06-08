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
var includeOperationName_1 = tslib_1.__importDefault(require("../helpers/includeOperationName"));
var GenerateOperation = /** @class */ (function () {
    function GenerateOperation() {
    }
    /**
     * Groups all http verbs for each path to then generate each operation file
     */
    GenerateOperation.prototype.files = function (config, fileType) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                // Iterate over all paths
                // pathProperties = all the http verbs and their contents
                // pathName = the full path after the basepath
                if (config.data.swagger.paths) {
                    return [2 /*return*/, this.openapiFiles(config, fileType)];
                }
                else if (config.data.swagger.channels) {
                    return [2 /*return*/, this.asyncApiFiles(config, fileType)];
                }
                return [2 /*return*/];
            });
        });
    };
    GenerateOperation.prototype.openapiFiles = function (config, fileType) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var files, _a, _b, _i, operationNameItem, operation;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        files = {};
                        lodash_1.each(config.data.swagger.paths, function (pathProperties, pathName) {
                            var operationName = pathProperties.endpointName;
                            if (includeOperationName_1["default"](operationName, config.data.nodegenRc)) {
                                files[operationName] = files[operationName] || [];
                                pathName = pathName.replace(/}/g, '').replace(/{/g, ':');
                                files[operationName].push({
                                    path_name: pathName,
                                    path: pathProperties,
                                    subresource: generateSubresourceName_1["default"](pathName, operationName)
                                });
                            }
                        });
                        _a = [];
                        for (_b in files)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        operationNameItem = _a[_i];
                        operation = files[operationNameItem];
                        return [4 /*yield*/, this.file(config, operation, operationNameItem, fileType)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, files];
                }
            });
        });
    };
    GenerateOperation.prototype.asyncApiFiles = function (config, fileType) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var files, _a, _b, _i, operationNameItem, operation;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        files = {};
                        lodash_1.each(config.data.swagger.channels, function (pathProperties, pathName) {
                            var subscribeIds = config.data.nodegenRc.helpers.subscribeOpIds || [];
                            if (pathProperties.subscribe && subscribeIds.includes(pathProperties.subscribe.operationId)) {
                                var operationName = pathProperties.subscribe.operationId;
                                files[operationName] = files[operationName] || [];
                                files[operationName].push({
                                    channelName: pathName,
                                    channel: pathProperties,
                                    subresource: generateSubresourceName_1["default"](pathName, operationName)
                                });
                            }
                        });
                        _a = [];
                        for (_b in files)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        operationNameItem = _a[_i];
                        operation = files[operationNameItem];
                        return [4 /*yield*/, this.file(config, operation, operationNameItem, fileType)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, files];
                }
            });
        });
    };
    /**
     * Generate an operation file
     */
    GenerateOperation.prototype.file = function (config, operations, operationName, fileType, verbose, additionalTplContent, toFunction) {
        if (verbose === void 0) { verbose = false; }
        if (additionalTplContent === void 0) { additionalTplContent = {}; }
        if (toFunction === void 0) { toFunction = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var filePath, data, subDir, ext, newFilename, targetFile, tplVars, renderedContent;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path_1["default"].join(config.root, config.file_name);
                        data = fs_extra_1["default"].readFileSync(filePath, 'utf8');
                        subDir = config.root.replace(new RegExp(config.templates_dir + "[/]?"), '');
                        ext = NamingUtils_1["default"].getFileExt(config.file_name);
                        newFilename = NamingUtils_1["default"].fixRouteName(NamingUtils_1["default"].generateOperationSuffix(subDir, operationName, ext));
                        targetFile = path_1["default"].resolve(config.targetDir, subDir, newFilename);
                        fs_extra_1["default"].ensureDirSync(path_1["default"].resolve(config.targetDir, subDir));
                        tplVars = this.templateVariables(operationName, operations, config, additionalTplContent, verbose, fileType);
                        renderedContent = '';
                        try {
                            renderedContent = TemplateRenderer_1["default"].load(data.toString(), tplVars, ext);
                        }
                        catch (e) {
                            console.log(targetFile);
                            throw new Error(e);
                        }
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
     */
    GenerateOperation.prototype.templateVariables = function (operationName, operations, config, additionalTplContent, verbose, fileType) {
        if (additionalTplContent === void 0) { additionalTplContent = {}; }
        if (verbose === void 0) { verbose = false; }
        return tslib_1.__assign({ operation_name: lodash_1["default"].camelCase(operationName.replace(/[}{]/g, '')), fileType: fileType,
            config: config,
            operations: operations, swagger: config.data.swagger, mockServer: config.mockServer || false, nodegenRc: config.data.nodegenRc, verbose: verbose }, additionalTplContent);
    };
    return GenerateOperation;
}());
exports["default"] = new GenerateOperation();
