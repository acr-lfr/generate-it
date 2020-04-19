"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var isValidMethod_1 = tslib_1.__importDefault(require("./isValidMethod"));
exports["default"] = (function (operations, attr) {
    var found = false;
    // console.log(JSON.stringify(operations, null, 2));
    operations.forEach(function (op) {
        for (var method in op.path) {
            if (isValidMethod_1["default"](method)) {
                if (op.path[method][attr]) {
                    found = true;
                }
            }
        }
    });
    return found;
});
