"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var prettier_1 = tslib_1.__importDefault(require("prettier"));
/**
 * Prettyfies tendered tpl content
 * @param content
 * @param ext
 */
exports["default"] = (function (content, ext) {
    return prettier_1["default"].format(content, {
        bracketSpacing: true,
        endOfLine: 'auto',
        semi: true,
        singleQuote: true,
        parser: ext === 'ts' ? 'typescript' : 'babel'
    });
});
