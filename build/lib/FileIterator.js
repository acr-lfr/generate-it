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
    FileWalker.prototype.calculateTemplatePath = function (dir, filename) {
        return path_1["default"].resolve(this.config.targetDir, path_1["default"].relative(this.config.templates, path_1["default"].resolve(dir, filename)));
    };
    FileWalker.prototype.buildPathDataObject = function (root, filename) {
        return {
            root: root,
            templates_dir: this.config.templates,
            targetDir: this.config.targetDir,
            package: this.config.package,
            data: this.config,
            file_name: filename,
            segmentsCount: this.config.segmentsCount,
            mockServer: this.config.mockServer
        };
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
            var templatePath, generationDataObject, fileType, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (isFileToIngore_1["default"](root, stats.name)) {
                            return [2 /*return*/, next()];
                        }
                        global.veryVerboseLogging('Dir:' + root);
                        global.veryVerboseLogging('File:' + stats.name);
                        templatePath = this.calculateTemplatePath(root, stats.name);
                        generationDataObject = this.buildPathDataObject(root, stats.name);
                        fileType = FileTypeCheck_1["default"].getFileType(generationDataObject.file_name);
                        _a = fileType;
                        switch (_a) {
                            case FileTypeCheck_1["default"].INTERFACE: return [3 /*break*/, 1];
                            case FileTypeCheck_1["default"].OTHER: return [3 /*break*/, 3];
                            case FileTypeCheck_1["default"].OPERATION_INDEX: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 6];
                    case 1: return [4 /*yield*/, (new GenerateInterfaceFiles_1["default"](generationDataObject)).writeFiles()];
                    case 2:
                        _e.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, generateFile_1["default"](generationDataObject, this.isFirstRun)];
                    case 4:
                        _e.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        this.files[fileType] = { generationDataObject: generationDataObject };
                        return [3 /*break*/, 6];
                    case 6:
                        if (!((this.config.mockServer && fileType === FileTypeCheck_1["default"].MOCK) || fileType === FileTypeCheck_1["default"].STUB || fileType === FileTypeCheck_1["default"].OPERATION)) return [3 /*break*/, 8];
                        _b = this.files;
                        _c = fileType;
                        _d = {};
                        return [4 /*yield*/, generateOperationFiles_1["default"](generationDataObject)];
                    case 7:
                        _b[_c] = (_d.files = _e.sent(),
                            _d.generationDataObject = generationDataObject,
                            _d);
                        _e.label = 8;
                    case 8:
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
