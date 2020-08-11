"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var _ = tslib_1.__importStar(require("lodash"));
var isValidMethod_1 = tslib_1.__importDefault(require("./isValidMethod"));
exports["default"] = (function (operations, attr, nestedPath) {
    var found = false;
    for (var key in operations) {
        var op = operations[key];
        var _loop_1 = function (method) {
            if (isValidMethod_1["default"](method)) {
                if (op.path[method][attr]) {
                    if (!nestedPath) {
                        found = true;
                    }
                    else {
                        var nestedParts = nestedPath.split('.');
                        var objectToLookIn_1 = op.path[method][attr];
                        nestedParts.forEach(function (part) {
                            if (objectToLookIn_1) {
                                if (Array.isArray(objectToLookIn_1)) {
                                    objectToLookIn_1 = objectToLookIn_1.find(function (item) {
                                        return item[part] !== undefined;
                                    });
                                    if (objectToLookIn_1) {
                                        objectToLookIn_1 = objectToLookIn_1[part];
                                    }
                                }
                                else {
                                    objectToLookIn_1 = _.get(objectToLookIn_1, part);
                                }
                            }
                        });
                        if (objectToLookIn_1 !== undefined) {
                            found = true;
                        }
                    }
                }
            }
        };
        for (var method in op.path) {
            _loop_1(method);
        }
    }
    return found;
});
