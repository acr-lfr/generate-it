"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const arrayContains_1 = tslib_1.__importDefault(require("../arrayContains"));
it('Should return true for an exact match', () => {
    expect(arrayContains_1.default('bob', ['tim', 'bob'])).toBe(true);
});
it('Should return true for a loose match', () => {
    expect(arrayContains_1.default('ob', ['tim', 'bob'])).toBe(true);
});
it('Should return false for a loose match', () => {
    expect(arrayContains_1.default('car', ['tim', 'bob'])).toBe(false);
});
