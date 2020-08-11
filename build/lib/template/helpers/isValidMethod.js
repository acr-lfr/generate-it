"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ValidHttpMethods_1 = tslib_1.__importDefault(require("../../../constants/ValidHttpMethods"));
/**
 * Checks if a method is a valid HTTP method.
 */
exports["default"] = (function (method) {
    return (ValidHttpMethods_1["default"].indexOf(method.toUpperCase()) !== -1);
});
