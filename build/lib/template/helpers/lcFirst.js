"use strict";
exports.__esModule = true;
/**
 *
 * @param inputString to ucfirst
 * @returns {string}
 */
exports["default"] = (function (inputString) {
    if (typeof inputString !== 'string') {
        throw new Error('Param passed to lcfirst is not type string but type: ' + typeof inputString);
    }
    return inputString.charAt(0).toLowerCase() + inputString.slice(1);
});
