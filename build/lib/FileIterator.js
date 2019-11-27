"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var walk_1 = tslib_1.__importDefault(require("walk"));
var FileTypeCheck_1 = tslib_1.__importDefault(require("./FileTypeCheck"));
var generateFile_1 = tslib_1.__importDefault(require("./generateFile"));
var GenerateInterfaceFiles_1 = tslib_1.__importDefault(require("./GenerateInterfaceFiles"));
var generateOperationFile_1 = tslib_1.__importDefault(require("./generateOperationFile"));
var generateOperationFiles_1 = tslib_1.__importDefault(require("./generateOperationFiles"));
var isFileToIngore_1 = tslib_1.__importDefault(require("./isFileToIngore"));
var FileWalker = /** @class */ (function () {
    function FileWalker() {
        this.files = {};
    }
    /**
     * Walks over the file system compiling tpl files with the config data
     * @param {boolean} providedIsFirstRun
     * @param {object} providedConfig
     * @return {Promise<>}
     */
    FileWalker.prototype.walk = function (providedIsFirstRun, providedConfig) {
        var _this = this;
        this.config = providedConfig;
        this.isFirstRun = providedIsFirstRun;
        var targetDir = this.config.targetDir;
        var templatesDir = this.config.templates;
        fs_extra_1["default"].copySync(this.config.swaggerFilePath, path_1["default"].resolve(targetDir, 'dredd', 'swagger.yml'));
        return new Promise(function (resolve, reject) {
            walk_1["default"].walk(templatesDir, {
                followLinks: false
            }).on('file', function (root, stats, next) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var e_1;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.fileIteration(root, stats, next)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            console.error(e_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); })
                // @ts-ignore
                .on('errors', function (root, nodeStatsArray) {
                reject(nodeStatsArray);
            })
                .on('end', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.parseOpIndex()];
                        case 1:
                            _a.sent();
                            resolve();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    /**
     * Generates the opIndex tpl file
     * @return {Promise<void>}
     */
    FileWalker.prototype.parseOpIndex = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.files[FileTypeCheck_1["default"].OPERATION_INDEX]) return [3 /*break*/, 2];
                        return [4 /*yield*/, generateOperationFile_1["default"](this.files[FileTypeCheck_1["default"].OPERATION_INDEX].generationDataObject, [], 'index', true, {
                                operationFiles: this.files[FileTypeCheck_1["default"].OPERATION].files
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * The walker function for a single file
     * @param {string} root - The directory to the file
     * @param {string} stats - The name of the file
     * @param {function} next - The callback function to continue
     * @return {Promise<void>}
     */
    FileWalker.prototype.fileIteration = function (root, stats, next) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var targetDir, templatesDir, templatePath, generationDataObject, fileType, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (isFileToIngore_1["default"](root, stats.name)) {
                            return [2 /*return*/, next()];
                        }
                        global.veryVerboseLogging('Dir:' + root);
                        global.veryVerboseLogging('File:' + stats.name);
                        targetDir = this.config.targetDir;
                        templatesDir = this.config.templates;
                        templatePath = path_1["default"].resolve(targetDir, path_1["default"].relative(templatesDir, path_1["default"].resolve(root, stats.name)));
                        generationDataObject = {
                            root: root,
                            templates_dir: templatesDir,
                            targetDir: targetDir,
                            package: this.config.package,
                            data: this.config,
                            file_name: stats.name,
                            segmentsCount: this.config.segmentsCount,
                            mockServer: this.config.mockServer
                        };
                        fileType = FileTypeCheck_1["default"].getFileType(generationDataObject.file_name);
                        if (!(fileType === FileTypeCheck_1["default"].INTERFACE)) return [3 /*break*/, 2];
                        global.veryVerboseLogging('Interface file: ' + generationDataObject.file_name);
                        // iterates over the interfaces array in the swagger object creating multiple interface files
                        return [4 /*yield*/, (new GenerateInterfaceFiles_1["default"](generationDataObject)).writeFiles()];
                    case 1:
                        // iterates over the interfaces array in the swagger object creating multiple interface files
                        _d.sent();
                        return [3 /*break*/, 7];
                    case 2:
                        if (!((this.config.mockServer && fileType === FileTypeCheck_1["default"].MOCK) ||
                            fileType === FileTypeCheck_1["default"].STUB || fileType === FileTypeCheck_1["default"].OPERATION)) return [3 /*break*/, 4];
                        global.veryVerboseLogging('Mock|Stub|Operation file: ' + generationDataObject.file_name);
                        // this file should be handled for each in swagger.paths creating multiple path based files, eg domains or routes etc etc
                        _a = this.files;
                        _b = fileType;
                        _c = {};
                        return [4 /*yield*/, generateOperationFiles_1["default"](generationDataObject)];
                    case 3:
                        // this file should be handled for each in swagger.paths creating multiple path based files, eg domains or routes etc etc
                        _a[_b] = (_c.files = _d.sent(),
                            _c.generationDataObject = generationDataObject,
                            _c);
                        return [3 /*break*/, 7];
                    case 4:
                        if (!(fileType === FileTypeCheck_1["default"].OPERATION_INDEX)) return [3 /*break*/, 5];
                        this.files[fileType] = {
                            generationDataObject: generationDataObject
                        };
                        return [3 /*break*/, 7];
                    case 5:
                        if (!(fileType === FileTypeCheck_1["default"].OTHER)) return [3 /*break*/, 7];
                        // standard tpl file, no iterations, simple parse with the generationDataObject
                        return [4 /*yield*/, generateFile_1["default"](generationDataObject, this.isFirstRun)];
                    case 6:
                        // standard tpl file, no iterations, simple parse with the generationDataObject
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        if (templatePath.substr(templatePath.length - 3) === 'njk') {
                            fs_extra_1["default"].removeSync(templatePath);
                        }
                        global.veryVerboseLogging(root);
                        next();
                        return [2 /*return*/];
                }
            });
        });
    };
    return FileWalker;
}());
exports["default"] = new FileWalker();
