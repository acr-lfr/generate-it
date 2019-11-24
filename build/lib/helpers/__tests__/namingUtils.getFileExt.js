"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const NamingUtils_1 = tslib_1.__importDefault(require("../NamingUtils"));
const getfileExt = NamingUtils_1.default.getFileExt;
it('should return js from a simple js file name', () => {
    expect(getfileExt('hello/world.js')).toBe('js');
});
it('should return js from a js.njk file name', () => {
    expect(getfileExt('hello/world.js.njk')).toBe('js');
});
it('should return spec.js from file name', () => {
    expect(getfileExt('tests/world.spec.js.njk')).toBe('spec.js');
});
it('should return spec.js from file name', () => {
    expect(getfileExt('tests/world.spec.js')).toBe('spec.js');
});
//# sourceMappingURL=namingUtils.getFileExt.js.map