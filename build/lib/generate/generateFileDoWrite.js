"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var NamingUtils_1 = tslib_1.__importDefault(require("../helpers/NamingUtils"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
exports["default"] = (function (isFirstRun, templatePath, rootTplFilePath, nodegenDir) {
    if (isFirstRun) {
        return true;
    }
    if (!fs_extra_1["default"].existsSync(NamingUtils_1["default"].stripNjkExtension(templatePath))) {
        return true;
    }
    return !!rootTplFilePath.includes(nodegenDir);
});
