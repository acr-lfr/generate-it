"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var NodegenRc = /** @class */ (function () {
    function NodegenRc() {
    }
    /**
     * Fetched a local rc file or for a fresh install from the tpl directory
     * @param {string} tplDir - The tpl directory
     * @param targetDir
     */
    NodegenRc.prototype.fetch = function (tplDir, targetDir) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var base, rcName, localPath, tplRcFilePath;
            return tslib_1.__generator(this, function (_a) {
                base = targetDir;
                rcName = '.nodegenrc';
                localPath = path_1["default"].join(base, rcName);
                if (fs_extra_1["default"].pathExistsSync(localPath)) {
                    return [2 /*return*/, this.validate(localPath)];
                }
                else {
                    tplRcFilePath = path_1["default"].join(tplDir, rcName);
                    if (!fs_extra_1["default"].pathExistsSync(tplRcFilePath)) {
                        throw new Error('The tpl directory you are trying to use does not have a ' + rcName + ' file. Aborting the process.');
                    }
                    fs_extra_1["default"].copySync(tplRcFilePath, localPath);
                    return [2 /*return*/, this.validate(localPath)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Parses and validates a provided nodegenrc file
     * @param localNodegenPath
     * @return {{nodegenDir}|*}
     */
    NodegenRc.prototype.validate = function (localNodegenPath) {
        var nodegenRcOject;
        try {
            nodegenRcOject = fs_extra_1["default"].readJsonSync(localNodegenPath);
        }
        catch (e) {
            console.log('Failed to parse .nodegenrc file:' + localNodegenPath);
            throw e;
        }
        if (!nodegenRcOject.nodegenDir) {
            throw new Error('Missing .nodegenrc attribute: nodegenDir');
        }
        return nodegenRcOject;
    };
    return NodegenRc;
}());
exports["default"] = new NodegenRc();
