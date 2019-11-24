"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
/**
 * Generates an "operationId" attribute based on path and method names  <path><method>
 *
 * @private
 * @param  {String} methodName HTTP method name.
 * @param  {String} pathName   Path name.
 * @return {String}
 */
exports.default = (methodName, pathName) => {
    methodName = _.camelCase(methodName);
    if (pathName === '/') {
        return methodName;
    }
    const filePathParts = pathName.split('/');
    filePathParts.forEach((part, i) => {
        if (part[0] === '{') {
            part = part.slice(1, part.length - 1);
        }
        filePathParts[i] = _.upperFirst(part);
    });
    filePathParts.push(_.upperFirst(methodName));
    return _.camelCase(filePathParts.join(''));
};
