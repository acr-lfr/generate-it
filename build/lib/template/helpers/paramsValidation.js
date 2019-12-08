"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var SwaggerUtils_1 = tslib_1.__importDefault(require("../../helpers/SwaggerUtils"));
exports["default"] = (function (params) {
    return SwaggerUtils_1["default"].createJoiValidation(params);
});
