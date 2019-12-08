"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var commandRun_1 = tslib_1.__importDefault(require("../../utils/commandRun"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var camelCaseStringReplacement_1 = tslib_1.__importDefault(require("../helpers/camelCaseStringReplacement"));
var CachePaths_1 = require("../../constants/CachePaths");
var TemplateFetchURL = /** @class */ (function () {
    function TemplateFetchURL() {
    }
    TemplateFetchURL.prototype.getCacheFolder = function (targetGitCacheDir) {
        this.targetGitCacheDir = path_1["default"].join(targetGitCacheDir, CachePaths_1.GIT_DIRECTORY);
        return this.targetGitCacheDir;
    };
    /**
     * Generates a cache directory relative to the url given
     * @param url
     * @param targetGitCacheDir
     * @return {string}
     */
    TemplateFetchURL.prototype.calculateLocalDirectoryFromUrl = function (url, targetGitCacheDir) {
        var camelCaseUrl = camelCaseStringReplacement_1["default"](url, ['/', ':', '.', '-', '?', '#']);
        return path_1["default"].join(this.getCacheFolder(targetGitCacheDir), camelCaseUrl);
    };
    /**
     * Deletes the entire cache directory
     */
    TemplateFetchURL.prototype.cleanSingleCacheDir = function (cachePath) {
        if (!cachePath.includes(this.targetGitCacheDir)) {
            console.error('For safety all folder removals must live within node_modules of this package.');
            console.error('An incorrect cache folder path has been calculated, aborting! Please report this as an issue on gitHub.');
            throw new Error('Aborting openapi-nodegen, see above comments.');
        }
        console.log('Removing the cacheDir: ' + cachePath);
        fs_extra_1["default"].removeSync(cachePath);
    };
    /**
     * Throws an error if gitFetch is not installed
     * @return {Promise<boolean>}
     */
    TemplateFetchURL.prototype.hasGit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, commandRun_1["default"]('git', ['--help'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        console.error('No gitFetch cli found on this operating system');
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Runs a simple cache exists on the proposed local file path
     * @param cachePath
     * @return {boolean}
     */
    TemplateFetchURL.prototype.gitCacheExists = function (cachePath) {
        return fs_extra_1["default"].existsSync(cachePath);
    };
    /**
     * Fetches the contents of a gitFetch url to the local cache
     * @param {string} url - Url to fetch via gitFetch
     * @param targetGitCacheDir
     * @param dontUpdateTplCache
     * @return {Promise<string>}
     */
    TemplateFetchURL.prototype.gitFetch = function (url, targetGitCacheDir, dontUpdateTplCache) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cacheDirectory, urlParts, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hasGit()];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error('Could not fetch cache from gitFetch url as gitFetch is not locally installed');
                        }
                        cacheDirectory = this.calculateLocalDirectoryFromUrl(url, targetGitCacheDir);
                        urlParts = this.getUrlParts(url);
                        if (this.gitCacheExists(cacheDirectory) && dontUpdateTplCache) {
                            console.log('Template cache already found and bypass update true: ' + url);
                            return [2 /*return*/, cacheDirectory];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        if (!(this.gitCacheExists(cacheDirectory) && !urlParts.b)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.gitPull(cacheDirectory)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        this.cleanSingleCacheDir(cacheDirectory);
                        return [4 /*yield*/, this.gitClone(urlParts.url, cacheDirectory, urlParts.b)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_2 = _a.sent();
                        console.error('Could not clone or pull the given git repository!');
                        this.cleanSingleCacheDir(cacheDirectory);
                        throw e_2;
                    case 8: return [2 /*return*/, cacheDirectory];
                }
            });
        });
    };
    /**
     * Changes directory then pulls an expected git repo
     * @param cacheDirectory
     * @return {Promise<boolean>}
     */
    TemplateFetchURL.prototype.gitPull = function (cacheDirectory) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cwd, e_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cwd = process.cwd();
                        process.chdir(cacheDirectory);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('Updating git cache');
                        return [4 /*yield*/, commandRun_1["default"]('git', ['pull'], true)];
                    case 2:
                        _a.sent();
                        process.chdir(cwd);
                        return [2 /*return*/, true];
                    case 3:
                        e_3 = _a.sent();
                        process.chdir(cwd);
                        throw e_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clones a remote git url to a given local directory
     * @param url
     * @param cacheDirectory
     * @param gitBranchOrTag
     * @return {Promise<*>}
     */
    TemplateFetchURL.prototype.gitClone = function (url, cacheDirectory, gitBranchOrTag) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                console.log(cacheDirectory);
                console.log('Clone git repository');
                fs_extra_1["default"].ensureDirSync(cacheDirectory);
                if (gitBranchOrTag) {
                    return [2 /*return*/, commandRun_1["default"]('git', ['clone', '-b', gitBranchOrTag, url, cacheDirectory], true)];
                }
                else {
                    return [2 /*return*/, commandRun_1["default"]('git', ['clone', url, cacheDirectory], true)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     *
     * @param {string} url
     * @return {{b: string, url: string}}
     */
    TemplateFetchURL.prototype.getUrlParts = function (url) {
        var cloneUrl = url;
        var b;
        if (url.includes('#')) {
            var parts = url.split('#');
            cloneUrl = parts[0];
            b = parts[1];
        }
        return {
            url: cloneUrl,
            b: b
        };
    };
    /**
     * Returns local helpers name or full path to cached directory
     * @param {string} input - Either es6 | typescript | https github url |
     *                        local directory relative to where this package is called from
     * @param targetGitCacheDir
     * @param dontUpdateTplCache
     * @return {Promise<string>} - Returns the full path on the local drive to the tpl directory.
     */
    TemplateFetchURL.prototype.resolveTemplateType = function (input, targetGitCacheDir, dontUpdateTplCache) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(input.substring(0, 8) === 'https://')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.gitFetch(input, targetGitCacheDir, dontUpdateTplCache)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: throw new Error('The provided helpers argument must be a valid https url');
                }
            });
        });
    };
    return TemplateFetchURL;
}());
exports["default"] = new TemplateFetchURL();
