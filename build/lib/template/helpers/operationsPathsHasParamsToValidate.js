"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
var pathsHasParamsToValidate_1 = tslib_1.__importDefault(require("./pathsHasParamsToValidate"));
exports["default"] = (function (operations) {
    var hasParamsToValidate = false;
    if (operations) {
        operations.forEach(function (operation) {
            Object.keys(operation.path).forEach(function (pathVerb) {
                if (pathsHasParamsToValidate_1["default"](operation.path[pathVerb])) {
                    hasParamsToValidate = true;
                }
            });
        });
    }
    return hasParamsToValidate;
});
