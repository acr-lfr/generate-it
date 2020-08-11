"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var TextFileDiff = require('text-file-diff');
/**
 * Compares the diff between 2 file chunks
 * @param {string} oldTextFile - Old text filepath to compare
 * @param {string} newTextFile - New text filepath to compare
 * @return {Promise<{minus: *, difference: *, plus: *}>}
 */
exports["default"] = (function (oldTextFile, newTextFile) {
    if (oldTextFile === void 0) { oldTextFile = ''; }
    if (newTextFile === void 0) { newTextFile = ''; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var m, difference, minus, plus;
        return tslib_1.__generator(this, function (_a) {
            m = new TextFileDiff();
            difference = '';
            minus = 0;
            plus = 0;
            m.on('-', function (line, obj) {
                ++minus;
                var diffLine = "\n@line: " + obj.lineNumber + "-\n" + line;
                difference += diffLine.red;
            });
            m.on('+', function (line, obj) {
                ++plus;
                var diffLine = "\n@line: " + obj.lineNumber + "+\n" + line;
                difference += diffLine.green;
            });
            m.diff(oldTextFile, newTextFile);
            return [2 /*return*/, {
                    minus: minus,
                    plus: plus,
                    difference: difference
                }];
        });
    });
});
