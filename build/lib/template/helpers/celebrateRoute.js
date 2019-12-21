"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var _ = tslib_1.__importStar(require("lodash"));
var pathsHasParamsToValidate_1 = tslib_1.__importDefault(require("./pathsHasParamsToValidate"));
/**
 * @deprecated WARNING this will be removed, please add this to the templates directly.
 * @param operationName
 * @param parameters
 * @param operationId
 */
exports["default"] = (function (operationName, parameters, operationId) {
    var celebrate = false;
    if (parameters) {
        celebrate = pathsHasParamsToValidate_1["default"]({
            parameters: parameters
        });
    }
    return (celebrate) ? 'celebrate(' + _.camelCase(operationName) + 'Validators.' + operationId + '),' : '';
});
