"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
exports.CACHE_DIRECTORY = '.openapi-nodegen/cache';
exports.COMPARE_DIRECTORY = 'compare';
exports.GITBASE_DIRECTORY = 'git';
class OpenapiCacheFolder {
    constructor(targetParentDirectory) {
        this.targetParentDirectory = targetParentDirectory;
    }
    getCacheBaseDir() {
        return path_1.default.join(this.targetParentDirectory, exports.CACHE_DIRECTORY);
    }
    getCacheCompareDir() {
        return path_1.default.join(this.getCacheBaseDir(), exports.COMPARE_DIRECTORY);
    }
    getGitTplDir() {
        return path_1.default.join(this.getCacheBaseDir(), exports.GITBASE_DIRECTORY);
    }
}
exports.default = OpenapiCacheFolder;
//# sourceMappingURL=OpenapiCacheFolder.js.map