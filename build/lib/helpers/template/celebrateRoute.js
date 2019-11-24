"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
module.exports = (operationName, parameters, operationId) => {
    let celebrate = false;
    if (parameters) {
        parameters.forEach((param) => {
            if (['path', 'query', 'body'].indexOf(param.in) !== -1) {
                celebrate = true;
            }
        });
    }
    return (celebrate) ? 'celebrate(' + _.camelCase(operationName) + 'Validators.' + operationId + '),' : '';
};
