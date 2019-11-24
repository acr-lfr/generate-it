"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
 */
exports.default = (operations) => {
    let celebrate = false;
    if (operations) {
        operations.forEach((operation) => {
            Object.keys(operation.path).forEach((pathVerb) => {
                const path = operation.path[pathVerb];
                if (path.parameters) {
                    path.parameters.forEach((param) => {
                        if (['path', 'query', 'body'].indexOf(param.in) !== -1) {
                            celebrate = true;
                        }
                    });
                }
            });
        });
    }
    return (celebrate) ? 'import { celebrate } from \'celebrate\'' : '';
};
