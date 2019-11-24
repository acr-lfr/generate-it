"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const FileTypeCheck_1 = tslib_1.__importDefault(require("../FileTypeCheck"));
it('OP return true', async () => {
    expect(FileTypeCheck_1.default.isOpertationFile('___op.js.njk')).toBe(true);
});
it('OP return false', async () => {
    expect(FileTypeCheck_1.default.isOpertationFile('__op.js.njk')).toBe(false);
    expect(FileTypeCheck_1.default.isOpertationFile('___OP.js.njk')).toBe(false);
    expect(FileTypeCheck_1.default.isOpertationFile('bob')).toBe(false);
});
it('MOCK return true', async () => {
    expect(FileTypeCheck_1.default.isMockFile('___mock.js.njk')).toBe(true);
});
it('MOCK return false', async () => {
    expect(FileTypeCheck_1.default.isMockFile('__mock.js.njk')).toBe(false);
    expect(FileTypeCheck_1.default.isMockFile('___MOCK.js.njk')).toBe(false);
    expect(FileTypeCheck_1.default.isMockFile('bob')).toBe(false);
});
it('STUB return true', async () => {
    expect(FileTypeCheck_1.default.isStubFile('___stub.js.njk')).toBe(true);
});
it('STUB return false', async () => {
    expect(FileTypeCheck_1.default.isStubFile('__stub.js.njk')).toBe(false);
    expect(FileTypeCheck_1.default.isStubFile('___STUB.js.njk')).toBe(false);
    expect(FileTypeCheck_1.default.isStubFile('bob')).toBe(false);
});
it('INTERFACE return true', async () => {
    expect(FileTypeCheck_1.default.isInterfaceFile('___interface.js.njk')).toBe(true);
});
it('INTERFACE return false', async () => {
    expect(FileTypeCheck_1.default.isInterfaceFile('__interface.js.njk')).toBe(false);
    expect(FileTypeCheck_1.default.isInterfaceFile('___INTERFACE.js.njk')).toBe(false);
    expect(FileTypeCheck_1.default.isInterfaceFile('bob')).toBe(false);
});
//# sourceMappingURL=FileTypeCheck.js.map