"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commandRun_1 = tslib_1.__importDefault(require("./commandRun"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
const camelCaseStringReplacement_1 = tslib_1.__importDefault(require("./helpers/camelCaseStringReplacement"));
const CachePaths_1 = require("../constants/CachePaths");
class TemplateFetchURL {
    getCacheFolder(targetGitCacheDir) {
        this.targetGitCacheDir = path_1.default.join(targetGitCacheDir, CachePaths_1.GIT_DIRECTORY);
        return this.targetGitCacheDir;
    }
    /**
     * Generates a cache directory relative to the url given
     * @param url
     * @param targetGitCacheDir
     * @return {string}
     */
    calculateLocalDirectoryFromUrl(url, targetGitCacheDir) {
        const camelCaseUrl = camelCaseStringReplacement_1.default(url, ['/', ':', '.', '-', '?', '#']);
        return path_1.default.join(this.getCacheFolder(targetGitCacheDir), camelCaseUrl);
    }
    /**
     * Deletes the entire cache directory
     */
    cleanSingleCacheDir(cachePath) {
        if (!cachePath.includes(this.targetGitCacheDir)) {
            console.error('For safety all folder removals must live within node_modules of this package.');
            console.error('An incorrect cache folder path has been calculated, aborting! Please report this as an issue on gitHub.');
            throw new Error('Aborting openapi-nodegen, see above comments.');
        }
        console.log('Removing the cacheDir: ' + cachePath);
        fs_extra_1.default.removeSync(cachePath);
    }
    /**
     * Throws an error if gitFetch is not installed
     * @return {Promise<boolean>}
     */
    async hasGit() {
        try {
            await commandRun_1.default('git', ['--help']);
            return true;
        }
        catch (e) {
            console.error('No gitFetch cli found on this operating system');
            return false;
        }
    }
    /**
     * Runs a simple cache exists on the proposed local file path
     * @param cachePath
     * @return {boolean}
     */
    gitCacheExists(cachePath) {
        return fs_extra_1.default.existsSync(cachePath);
    }
    /**
     * Fetches the contents of a gitFetch url to the local cache
     * @param {string} url - Url to fetch via gitFetch
     * @param targetGitCacheDir
     * @return {Promise<string>}
     */
    async gitFetch(url, targetGitCacheDir) {
        if (!await this.hasGit()) {
            throw new Error('Could not fetch cache from gitFetch url as gitFetch is not locally installed');
        }
        const cacheDirectory = this.calculateLocalDirectoryFromUrl(url, targetGitCacheDir);
        const urlParts = this.getUrlParts(url);
        try {
            if (this.gitCacheExists(cacheDirectory)) {
                if (urlParts.b) {
                    this.cleanSingleCacheDir(cacheDirectory);
                    await this.gitClone(url, cacheDirectory);
                }
                else {
                    await this.gitPull(cacheDirectory);
                }
            }
            else {
                await this.gitClone(url, cacheDirectory);
            }
        }
        catch (e) {
            console.error('Could not clone or pull the given git repository!');
            this.cleanSingleCacheDir(cacheDirectory);
            throw e;
        }
        return cacheDirectory;
    }
    /**
     * Changes directory then pulls an expected git repo
     * @param cacheDirectory
     * @return {Promise<boolean>}
     */
    async gitPull(cacheDirectory) {
        const cwd = process.cwd();
        process.chdir(cacheDirectory);
        try {
            console.log('Updating git cache');
            await commandRun_1.default('git', ['pull'], true);
            process.chdir(cwd);
            return true;
        }
        catch (e) {
            process.chdir(cwd);
            throw e;
        }
    }
    /**
     * Clones a remote git url to a given local directory
     * @param url
     * @param cacheDirectory
     * @return {Promise<*>}
     */
    async gitClone(url, cacheDirectory) {
        console.log(cacheDirectory);
        console.log('Clone git repository');
        const urlParts = this.getUrlParts(url);
        if (urlParts.b) {
            return commandRun_1.default('git', ['clone', '-b', urlParts.b, urlParts.url, cacheDirectory], true);
        }
        else {
            return commandRun_1.default('git', ['clone', urlParts.url, cacheDirectory], true);
        }
    }
    /**
     *
     * @param {string} url
     * @return {{b: string, url: string}}
     */
    getUrlParts(url) {
        let cloneUrl = url;
        let b;
        if (url.includes('#')) {
            const parts = url.split('#');
            cloneUrl = parts[0];
            b = parts[1];
        }
        return {
            url: cloneUrl,
            b,
        };
    }
    /**
     * Returns local template name or full path to cached directory
     * @param {string} input - Either es6 | typescript | https github url |
     *                        local directory relative to where this package is called from
     * @param targetGitCacheDir
     * @return {Promise<string>} - Returns the full path on the local drive to the tpl directory.
     */
    async resolveTemplateType(input, targetGitCacheDir) {
        if (input.substring(0, 8) === 'https://') {
            return await this.gitFetch(input, targetGitCacheDir);
        }
        else {
            throw new Error('The provided template argument must be a valid https url');
        }
    }
}
exports.default = new TemplateFetchURL();
//# sourceMappingURL=TemplateFetch.js.map