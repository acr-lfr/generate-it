"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lcFirst_1 = tslib_1.__importDefault(require("./template/lcFirst"));
const ucFirst_1 = tslib_1.__importDefault(require("./template/ucFirst"));
/**
 *
 * @param input
 * @param {string|array} replace - String or array of string replacements
 * @return {string}
 */
exports.default = (input, replace) => {
    if (typeof replace === 'string') {
        replace = [replace];
    }
    if (!Array.isArray(replace)) {
        throw Error('The replace values must be either a string or an array of strings.');
    }
    let returnString = '';
    replace.forEach((replaceItem, i) => {
        const replaceInString = (i === 0) ? input : returnString;
        returnString = lcFirst_1.default((replaceInString.split(replaceItem).map((part) => {
            return ucFirst_1.default(part);
        })).join(''));
    });
    return returnString;
};
//# sourceMappingURL=camelCaseStringReplacement.js.map