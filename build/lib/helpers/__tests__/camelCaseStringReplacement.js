"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var camelCaseStringReplacement_1 = tslib_1.__importDefault(require("../camelCaseStringReplacement"));
describe('Single replacer entries', function () {
    it('Should split spaces to return helloWorldHowAreYou', function () {
        expect(camelCaseStringReplacement_1["default"]('Hello world how are you', ' ')).toBe('helloWorldHowAreYou');
    });
    it('Should split dots to return wwwAcrontumDe', function () {
        expect(camelCaseStringReplacement_1["default"]('www.acrontum.de', '.')).toBe('wwwAcrontumDe');
    });
    it('Should split dots to return wwwAcrontumDe with double entries', function () {
        expect(camelCaseStringReplacement_1["default"]('www.acrontum..de', '.')).toBe('wwwAcrontumDe');
    });
    it('Should split dots to return wwwAcrontumDe with tripple entries', function () {
        expect(camelCaseStringReplacement_1["default"]('.www..acrontum...de', '.')).toBe('wwwAcrontumDe');
    });
});
describe('Array of replacer values', function () {
    it('Replace dots, slashes and colon', function () {
        expect(camelCaseStringReplacement_1["default"]('https://www.acrontum.de', ['.', '/', ':'])).toBe('httpsWwwAcrontumDe');
    });
    it('Replace dots, slashes and colon with double and tripple entries', function () {
        expect(camelCaseStringReplacement_1["default"]('https:://www.acrontum..de', ['.', '/', ':'])).toBe('httpsWwwAcrontumDe');
    });
});
