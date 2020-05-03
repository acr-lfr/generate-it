"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var generateFileDoWrite_1 = tslib_1.__importDefault(require("../generateFileDoWrite"));
var tplPath = 'src/lib/generate/__tests__/generateFileDoWrite.ts';
var thisFilePath = path_1["default"].join(process.cwd(), tplPath);
it('should return true for 1st run', function () {
    expect(generateFileDoWrite_1["default"](true, thisFilePath, '/', 'http/nodegen')).toBe(true);
});
it('should return true for tpl file that does not exist', function () {
    expect(generateFileDoWrite_1["default"](false, 'some/path/that/deoesnot/exist', tplPath, 'src/lib')).toBe(true);
});
it('should return true', function () {
    expect(generateFileDoWrite_1["default"](false, thisFilePath, tplPath, 'src/lib')).toBe(true);
});
it('should return true', function () {
    expect(generateFileDoWrite_1["default"](false, thisFilePath, tplPath, 'src/nodegen')).toBe(false);
});
