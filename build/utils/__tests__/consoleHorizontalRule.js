"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var consoleHorizontalRule_1 = tslib_1.__importDefault(require("../consoleHorizontalRule"));
it('should return the correct qty of dashes', function () {
    var actual = process.stdout.columns;
    process.stdout.columns = 15;
    expect(consoleHorizontalRule_1["default"]().length).toBe(15);
    process.stdout.columns = actual;
});
