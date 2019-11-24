"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param inputString to ucfirst
 * @returns {string}
 */
exports.default = (inputString) => {
    if (typeof inputString !== 'string') {
        throw new Error('Param passed to ucfirst is not type string but type: ' + typeof inputString);
    }
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
};
