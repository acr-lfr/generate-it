"use strict";
exports.__esModule = true;
/**
 * Returns true if any item within the haystack contains the needle
 * @param {string} needle
 * @param {array} haystack
 * @return {boolean}
 */
exports["default"] = (function (needle, haystack) {
    if (needle === void 0) { needle = ''; }
    if (haystack === void 0) { haystack = []; }
    for (var i = 0; i < haystack.length; ++i) {
        var item = haystack[i];
        if (needle === item) {
            return true;
        }
        if (item.indexOf(needle) !== -1) {
            return true;
        }
    }
    return false;
});
