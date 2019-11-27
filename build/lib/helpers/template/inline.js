"use strict";
exports.__esModule = true;
/**
 * Converts a multi-line string to a single line.
 */
exports["default"] = (function (str) {
    return str ? str.replace(/\n/g, '') : '';
});
