"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var NamingUtils_1 = tslib_1.__importDefault(require("../NamingUtils"));
var getfileExt = NamingUtils_1["default"].getFileExt;
it('should return js from a simple js file name', function () {
    expect(getfileExt('hello/world.js')).toBe('js');
});
it('should return js from a js.njk file name', function () {
    expect(getfileExt('hello/world.js.njk')).toBe('js');
});
it('should return spec.js from file name', function () {
    expect(getfileExt('tests/world.spec.js.njk')).toBe('spec.js');
});
it('should return spec.js from file name', function () {
    expect(getfileExt('tests/world.spec.js')).toBe('spec.js');
});
