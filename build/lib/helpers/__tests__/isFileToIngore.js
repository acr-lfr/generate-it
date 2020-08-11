"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var isFileToIngore_1 = tslib_1.__importDefault(require("../isFileToIngore"));
describe('Should no allow directories on black list, eg git idea vscode, even as a file', function () {
    it('should no allow git paths', function () {
        expect(isFileToIngore_1["default"]('som/dir/.git', 'config')).toBe(true);
    });
    it('should no allow idea paths', function () {
        expect(isFileToIngore_1["default"]('som/dir/.idea', 'workspace')).toBe(true);
    });
    it('should no allow vscode paths', function () {
        expect(isFileToIngore_1["default"]('som/dir/.vscode', 'workspace')).toBe(true);
    });
    it('should no allow vscode paths', function () {
        expect(isFileToIngore_1["default"]('som/dir/vscode', '.vscode')).toBe(true);
    });
});
describe('Should other directories in and .njk files', function () {
    it('should allow http paths', function () {
        expect(isFileToIngore_1["default"]('som/dir/http', 'config')).toBe(false);
    });
    it('should allow http paths', function () {
        expect(isFileToIngore_1["default"]('som/dir/http', '___op.njk')).toBe(false);
    });
});
