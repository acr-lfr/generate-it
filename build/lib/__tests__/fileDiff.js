"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fileDiff_1 = tslib_1.__importDefault(require("../fileDiff"));
var path_1 = tslib_1.__importDefault(require("path"));
it('should return ', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var a, diff;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                a = path_1["default"].join(process.cwd(), 'src/lib/__tests__/fileDiff.ts');
                return [4 /*yield*/, fileDiff_1["default"](a, a)];
            case 1:
                diff = _a.sent();
                expect(diff).toEqual({ minus: 0, plus: 0, difference: '' });
                return [2 /*return*/];
        }
    });
}); });
it('should return ', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var a, b, diff;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                a = path_1["default"].join(process.cwd(), 'src/lib/__tests__/txtFile1.txt');
                b = path_1["default"].join(process.cwd(), 'src/lib/__tests__/txtFile2.txt');
                return [4 /*yield*/, fileDiff_1["default"](a, b)];
            case 1:
                diff = _a.sent();
                expect(diff.minus).toEqual(3);
                expect(diff.plus).toEqual(3);
                return [2 /*return*/];
        }
    });
}); });
