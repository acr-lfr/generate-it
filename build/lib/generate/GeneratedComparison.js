"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
require("colors");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var consoleHorizontalRule_1 = tslib_1.__importDefault(require("../../utils/consoleHorizontalRule"));
var fileDiff_1 = tslib_1.__importDefault(require("../diff/fileDiff"));
var CachePaths_1 = require("../../constants/CachePaths");
var GeneratedComparison = /** @class */ (function () {
    function GeneratedComparison() {
    }
    GeneratedComparison.prototype.getCacheBaseDir = function (targetParentDirectory) {
        return path_1["default"].join(targetParentDirectory, CachePaths_1.COMPARE_DIRECTORY);
    };
    /**
     * Retutns a path to the config cache compare dir
     * @param {string} targetParentDirectory - The
     * @return {string}
     */
    GeneratedComparison.prototype.getCacheCompareConfigPath = function (targetParentDirectory) {
        return path_1["default"].join(this.getCacheBaseDir(targetParentDirectory), 'config.json');
    };
    /**
     * fetch the config json from the compare dir
     * @param jsonFilePath
     * @return {{versions: {}}}
     */
    GeneratedComparison.prototype.getCacheCompareJson = function (jsonFilePath) {
        var json;
        if (fs_extra_1["default"].pathExistsSync(jsonFilePath)) {
            json = fs_extra_1["default"].readJsonSync(jsonFilePath);
        }
        else {
            json = {
                versions: {}
            };
        }
        return json;
    };
    /**
     * Ensures the compare dir exists and returns its path
     * @param targetParentDirectory
     * @return {string}
     */
    GeneratedComparison.prototype.getCompareDirectory = function (targetParentDirectory) {
        var compareDir = path_1["default"].join(targetParentDirectory, CachePaths_1.COMPARE_DIRECTORY);
        fs_extra_1["default"].ensureDirSync(compareDir);
        return compareDir;
    };
    /**
     *
     * @param targetParentDirectory
     * @return {Promise<string|*>}
     */
    GeneratedComparison.prototype.fileDiffs = function (targetParentDirectory) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var json = _this.getCacheCompareJson(_this.getCacheCompareConfigPath(targetParentDirectory));
            var versions = Object.keys(json.versions).sort();
            if (versions.length <= 1) {
                console.log('No previous files to compare from, a diff comparison chart will be available after the next generation.');
                return resolve('');
            }
            var newVersionKey = versions.pop();
            var oldVersionKey = versions.pop();
            var error = false;
            Object.keys(json.versions[newVersionKey]).forEach(function (directory) {
                var newFilePath = path_1["default"].join(directory, newVersionKey);
                if (json.versions[oldVersionKey][directory]) {
                    var oldFilePath = path_1["default"].join(directory, oldVersionKey);
                    try {
                        fileDiff_1["default"](oldFilePath, newFilePath)
                            .then(function (diff) {
                            json.versions[newVersionKey][directory].diff = diff;
                        })["catch"](function (e) {
                            error = e;
                        });
                    }
                    catch (e) {
                        error = e;
                    }
                }
            });
            return !error ? resolve(json.versions[newVersionKey]) : reject(error);
        });
    };
    /**
     * Console logs a table of file diffs
     * @param outputDir
     * @param input
     */
    GeneratedComparison.prototype.fileDiffsPrint = function (outputDir, input) {
        if (typeof input === 'string' && input !== '') {
            return console.log(input);
        }
        var logDiffs = {};
        var cacheCompareDir = this.getCompareDirectory(outputDir);
        var buildDiff = function (add, minus) {
            this.added = add;
            this.removed = minus;
            this.message = (add > 0 || minus > 0) ? 'Diff print in full above' : 'No differences';
        };
        Object.keys(input).forEach(function (key) {
            var displayPath = key.replace(cacheCompareDir, '');
            if (input[key].diff && input[key].diff.difference && input[key].diff.difference.length > 0) {
                console.log(consoleHorizontalRule_1["default"]());
                console.log('START' + displayPath.bold);
                console.log(input[key].diff.difference);
                console.log('END' + displayPath.bold);
                console.log(consoleHorizontalRule_1["default"]());
            }
            // @ts-ignore
            logDiffs[displayPath] = new buildDiff(input[key].diff.plus, input[key].diff.minus);
        });
        console.table(logDiffs);
    };
    GeneratedComparison.prototype.versionCleanup = function (targetParentDirectory) {
        var configPath = this.getCacheCompareConfigPath(targetParentDirectory);
        var json = this.getCacheCompareJson(configPath);
        var versions = Object.keys(json.versions).sort().reverse();
        if (versions.length >= CachePaths_1.MAX_CACHE_COUNT) {
            versions.forEach(function (version, i) {
                if (i >= CachePaths_1.MAX_CACHE_COUNT) {
                    var paths_1 = Object.keys(json.versions[version]);
                    paths_1.forEach(function (singlePath, j) {
                        paths_1[j] = path_1["default"].join(singlePath, '/', version);
                    });
                    paths_1.forEach(function (singlePath) {
                        fs_extra_1["default"].removeSync(singlePath);
                    });
                    delete json.versions[version];
                }
            });
        }
        fs_extra_1["default"].writeJsonSync(configPath, json, {
            spaces: 2
        });
    };
    /**
     * Compares the new content for the proposed stub file that already exists on the file system.
     * If there is not already a backup to compare, an error message is shown.
     * Once compared the new file contents are written to the backup location.
     * @param {string} targetFile - The target file the rendered content was destined for
     * @param {string} targetParentDirectory - The parent directory the output is destined for
     * @param {string} subDirectory - The sub-directory the target file was destined for
     * @param {string} newFilename - The new filename the output was for
     * @param {string} newFileString - The newly rendered content
     * @return {Promise<void>}
     */
    GeneratedComparison.prototype.generateComparisonFile = function (targetFile, targetParentDirectory, subDirectory, newFilename, newFileString) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var backupComparePath, backUpFile;
            return tslib_1.__generator(this, function (_a) {
                backupComparePath = path_1["default"].join(this.getCompareDirectory(targetParentDirectory), subDirectory, newFilename);
                backUpFile = path_1["default"].join(backupComparePath, '/', global.startISOString);
                fs_extra_1["default"].ensureFileSync(backUpFile);
                fs_extra_1["default"].ensureDirSync(backupComparePath);
                this.addToCacheComparisonReport(this.getCacheCompareConfigPath(targetParentDirectory), backupComparePath, global.startISOString);
                return [2 /*return*/, fs_extra_1["default"].writeFileSync(backUpFile, newFileString, 'utf8')];
            });
        });
    };
    /**
     * Adds a new path to the current cache comparison json
     * @param {string} jsonFilePath - Path to the json config file
     * @param {string} backupComparePath - Path to add
     * @param {string} isoTimstamp - Current runtime timestamp
     * @return {void}
     */
    GeneratedComparison.prototype.addToCacheComparisonReport = function (jsonFilePath, backupComparePath, isoTimstamp) {
        var json = this.getCacheCompareJson(jsonFilePath);
        if (!json.versions[isoTimstamp]) {
            json.versions[isoTimstamp] = {};
        }
        if (!json.versions[isoTimstamp][backupComparePath]) {
            json.versions[isoTimstamp][backupComparePath] = {
                diff: ''
            };
        }
        fs_extra_1["default"].writeJsonSync(jsonFilePath, json, {
            spaces: 2
        });
    };
    return GeneratedComparison;
}());
exports["default"] = new GeneratedComparison();
