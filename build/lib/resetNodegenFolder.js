"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs = tslib_1.__importStar(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
/**
 *
 * @param {string} targetDir
 * @param {string} templatesDir
 * @param {boolean} mocked
 * @param nodegenRc
 */
exports["default"] = (function (targetDir, templatesDir, mocked, nodegenRc) {
    if (mocked === void 0) { mocked = false; }
    var nodeGenDir = nodegenRc.nodegenDir;
    var copyFilter = {
        filter: function (src) {
            // ensure the njk files are not copied over
            return (src.indexOf('.njk') === -1);
        }
    };
    fs.removeSync(path_1["default"].join(targetDir, nodeGenDir));
    fs.copySync(path_1["default"].join(templatesDir, nodeGenDir), path_1["default"].join(targetDir, nodeGenDir), copyFilter);
    if (mocked) {
        var mocksDir = nodegenRc.nodegenMockDir;
        fs.removeSync(path_1["default"].join(targetDir, mocksDir));
        fs.copySync(path_1["default"].join(templatesDir, mocksDir), path_1["default"].join(targetDir, mocksDir), copyFilter);
    }
});
