"use strict";
exports.__esModule = true;
/**
 * Returns the single 200-level response in responses,
 * or undefined if not only 1 exists
 */
exports["default"] = (function (responses) {
    var codes = Object.keys(responses).filter(function (code) { return /^2[0-9]+$/.test(code); });
    return (codes === null || codes === void 0 ? void 0 : codes.length) === 1 ? parseInt(codes[0], 10) : undefined;
});
