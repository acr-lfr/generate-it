"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ValidHttpMethods_1 = tslib_1.__importDefault(require("../../../constants/ValidHttpMethods"));
/**
 * Checks if a method is a valid HTTP method.
 */
exports.default = (method) => {
    return (ValidHttpMethods_1.default.indexOf(method.toUpperCase()) !== -1);
};
//# sourceMappingURL=isValidMethod.js.map