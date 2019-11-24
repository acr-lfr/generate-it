"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const camelCaseStringReplacement_1 = tslib_1.__importDefault(require("../camelCaseStringReplacement"));
describe('Single replacer entries', () => {
    it('Should split spaces to return helloWorldHowAreYou', () => {
        expect(camelCaseStringReplacement_1.default('Hello world how are you', ' ')).toBe('helloWorldHowAreYou');
    });
    it('Should split dots to return wwwAcrontumDe', () => {
        expect(camelCaseStringReplacement_1.default('www.acrontum.de', '.')).toBe('wwwAcrontumDe');
    });
    it('Should split dots to return wwwAcrontumDe with double entries', () => {
        expect(camelCaseStringReplacement_1.default('www.acrontum..de', '.')).toBe('wwwAcrontumDe');
    });
    it('Should split dots to return wwwAcrontumDe with tripple entries', () => {
        expect(camelCaseStringReplacement_1.default('.www..acrontum...de', '.')).toBe('wwwAcrontumDe');
    });
});
describe('Array of replacer values', () => {
    it('Replace dots, slashes and colon', () => {
        expect(camelCaseStringReplacement_1.default('https://www.acrontum.de', ['.', '/', ':'])).toBe('httpsWwwAcrontumDe');
    });
    it('Replace dots, slashes and colon with double and tripple entries', () => {
        expect(camelCaseStringReplacement_1.default('https:://www.acrontum..de', ['.', '/', ':'])).toBe('httpsWwwAcrontumDe');
    });
});
//# sourceMappingURL=camelCaseStringReplacement.js.map