"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns true if any item within the haystack contains the needle
 * @param {string} needle
 * @param {array} haystack
 * @return {boolean}
 */
exports.default = (needle = '', haystack = []) => {
    for (let i = 0; i < haystack.length; ++i) {
        const item = haystack[i];
        if (needle === item) {
            return true;
        }
        if (item.indexOf(needle) !== -1) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=arrayContains.js.map