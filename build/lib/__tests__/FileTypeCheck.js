"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var FileTypeCheck_1 = tslib_1.__importDefault(require("../FileTypeCheck"));
it('OP return true', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        expect(FileTypeCheck_1["default"].isOpertationFile('___op.js.njk')).toBe(true);
        return [2 /*return*/];
    });
}); });
it('OP return false', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        expect(FileTypeCheck_1["default"].isOpertationFile('__op.js.njk')).toBe(false);
        expect(FileTypeCheck_1["default"].isOpertationFile('___OP.js.njk')).toBe(false);
        expect(FileTypeCheck_1["default"].isOpertationFile('bob')).toBe(false);
        return [2 /*return*/];
    });
}); });
it('MOCK return true', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        expect(FileTypeCheck_1["default"].isMockFile('___mock.js.njk')).toBe(true);
        return [2 /*return*/];
    });
}); });
it('MOCK return false', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        expect(FileTypeCheck_1["default"].isMockFile('__mock.js.njk')).toBe(false);
        expect(FileTypeCheck_1["default"].isMockFile('___MOCK.js.njk')).toBe(false);
        expect(FileTypeCheck_1["default"].isMockFile('bob')).toBe(false);
        return [2 /*return*/];
    });
}); });
it('STUB return true', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        expect(FileTypeCheck_1["default"].isStubFile('___stub.js.njk')).toBe(true);
        return [2 /*return*/];
    });
}); });
it('STUB return false', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        expect(FileTypeCheck_1["default"].isStubFile('__stub.js.njk')).toBe(false);
        expect(FileTypeCheck_1["default"].isStubFile('___STUB.js.njk')).toBe(false);
        expect(FileTypeCheck_1["default"].isStubFile('bob')).toBe(false);
        return [2 /*return*/];
    });
}); });
it('INTERFACE return true', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        expect(FileTypeCheck_1["default"].isInterfaceFile('___interface.js.njk')).toBe(true);
        return [2 /*return*/];
    });
}); });
it('INTERFACE return false', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        expect(FileTypeCheck_1["default"].isInterfaceFile('__interface.js.njk')).toBe(false);
        expect(FileTypeCheck_1["default"].isInterfaceFile('___INTERFACE.js.njk')).toBe(false);
        expect(FileTypeCheck_1["default"].isInterfaceFile('bob')).toBe(false);
        return [2 /*return*/];
    });
}); });
