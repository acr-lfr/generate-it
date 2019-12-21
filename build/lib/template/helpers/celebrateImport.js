"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
var operationsPathsHasParamsToValidate_1 = tslib_1.__importDefault(require("./operationsPathsHasParamsToValidate"));
/**
 * @deprecated WARNING this will be removed soon, please add this import into the templates directly.
 * @param operations
 */
exports["default"] = (function (operations) {
    return operationsPathsHasParamsToValidate_1["default"](operations) ? 'import { celebrate } from \'celebrate\'' : '';
});
