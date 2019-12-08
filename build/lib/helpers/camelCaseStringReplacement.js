"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var lcFirst_1 = tslib_1.__importDefault(require("../template/helpers/lcFirst"));
var ucFirst_1 = tslib_1.__importDefault(require("../template/helpers/ucFirst"));
/**
 *
 * @param input
 * @param {string|array} replace - String or array of string replacements
 * @return {string}
 */
exports["default"] = (function (input, replace) {
    if (typeof replace === 'string') {
        replace = [replace];
    }
    if (!Array.isArray(replace)) {
        throw Error('The replace values must be either a string or an array of strings.');
    }
    var returnString = '';
    replace.forEach(function (replaceItem, i) {
        var replaceInString = (i === 0) ? input : returnString;
        returnString = lcFirst_1["default"]((replaceInString.split(replaceItem).map(function (part) {
            return ucFirst_1["default"](part);
        })).join(''));
    });
    return returnString;
});
