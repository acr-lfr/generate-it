"use strict";
exports.__esModule = true;
/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
exports["default"] = (function (operations) {
    var celebrate = false;
    if (operations) {
        operations.forEach(function (operation) {
            Object.keys(operation.path).forEach(function (pathVerb) {
                var path = operation.path[pathVerb];
                if (path.parameters) {
                    path.parameters.forEach(function (param) {
                        if (['path', 'query', 'body'].indexOf(param["in"]) !== -1) {
                            celebrate = true;
                        }
                    });
                }
            });
        });
    }
    return (celebrate) ? 'import { celebrate } from \'celebrate\'' : '';
});
