"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var NamingUtils_1 = tslib_1.__importDefault(require("../NamingUtils"));
var stripNjkExtension = NamingUtils_1["default"].stripNjkExtension;
it('should return js from a simple test.js file name', function () {
    expect(stripNjkExtension('test.js.njk')).toBe('test.js');
});
it('should return js from a js.njk file name', function () {
    expect(stripNjkExtension('test.js.njk')).toBe('test.js');
});
