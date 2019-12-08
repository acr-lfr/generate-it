"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var _ = tslib_1.__importStar(require("lodash"));
/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
exports["default"] = (function (operationName, parameters, operationId) {
    var celebrate = false;
    if (parameters) {
        parameters.forEach(function (param) {
            if (['path', 'query', 'body'].indexOf(param["in"]) !== -1) {
                celebrate = true;
            }
        });
    }
    return (celebrate) ? 'celebrate(' + _.camelCase(operationName) + 'Validators.' + operationId + '),' : '';
});
