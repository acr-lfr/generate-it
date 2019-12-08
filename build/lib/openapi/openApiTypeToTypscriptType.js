"use strict";
exports.__esModule = true;
exports["default"] = (function (inputType) {
    switch (inputType) {
        case 'string':
            return 'string';
        case 'number':
            return 'number';
        case 'integer':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'array':
            return 'array';
        case 'object':
            return 'object';
        default:
            return 'any';
    }
});
