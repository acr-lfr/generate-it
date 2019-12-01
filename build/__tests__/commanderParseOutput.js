"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var commanderParseOutput_1 = tslib_1.__importDefault(require("../commanderParseOutput"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
it('Should resolve to directory that exists', function () {
    expect(fs_extra_1["default"].existsSync(commanderParseOutput_1["default"]('src/__tests__'))).toBe(true);
});
