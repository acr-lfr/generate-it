"use strict";
exports.__esModule = true;
/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
exports["default"] = (function (pathObject) {
    var hasParamsToValidate = false;
    if (pathObject.parameters) {
        pathObject.parameters.forEach(function (param) {
            if (['path', 'query', 'body'].indexOf(param["in"]) !== -1) {
                hasParamsToValidate = true;
            }
        });
    }
    return hasParamsToValidate;
});
