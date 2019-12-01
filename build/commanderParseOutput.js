"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
exports["default"] = (function (dir) {
    return path_1["default"].join(process.cwd(), dir);
});
