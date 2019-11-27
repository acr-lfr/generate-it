"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var _ = tslib_1.__importStar(require("lodash"));
function default_1() {
    var returnString = '';
    for (var arg in arguments) {
        if (arguments.hasOwnProperty(arg)) {
            returnString += _.trim(arguments[arg], '/');
        }
    }
    return returnString;
}
exports["default"] = default_1;
