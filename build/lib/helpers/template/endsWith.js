"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checks if a string ends with a provided value.
 */
exports.default = (subject, endvalue) => {
    return (String(subject)[subject.length - 1] === String(endvalue));
};
