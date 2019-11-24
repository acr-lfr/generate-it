"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const NamingUtils_1 = tslib_1.__importDefault(require("../NamingUtils"));
const stripNjkExtension = NamingUtils_1.default.stripNjkExtension;
it('should return js from a simple test.js file name', () => {
    expect(stripNjkExtension('test.js.njk')).toBe('test.js');
});
it('should return js from a js.njk file name', () => {
    expect(stripNjkExtension('test.js.njk')).toBe('test.js');
});
