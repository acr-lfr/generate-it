"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var TemplateFetch_1 = tslib_1.__importDefault(require("../TemplateFetch"));
var repoUrl = 'https://github.com/acrontum/openapi-nodegen.git';
var camelCaseUrl = '';
describe('calculateLocalDirectoryFromUrl should return valid directory', function () {
    it('camelcase a url and map to directory', function () {
        var tagertDir = path_1["default"].join(process.cwd(), '/bob/');
        var directory = TemplateFetch_1["default"].calculateLocalDirectoryFromUrl(repoUrl, tagertDir);
        camelCaseUrl = path_1["default"].join(tagertDir, '/.openapi-nodegen/git/httpsGithubComAcrontumOpenapiNodegenGit');
        expect(directory).toBe(camelCaseUrl);
    });
});
it('hasGit should not throw error', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = expect;
                return [4 /*yield*/, TemplateFetch_1["default"].hasGit()];
            case 1:
                _a.apply(void 0, [_b.sent()]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
describe('Test packageAndTplVersionOK', function () {
    it('Matching tags should be true', function () {
        expect(TemplateFetch_1["default"].packageAndTplVersionOK('4.1.0', '4.1.0')).toBe(true);
    });
    it('Greater minor or patch openapi version than tpl tag should be true', function () {
        expect(TemplateFetch_1["default"].packageAndTplVersionOK('4.0.13', '4.0.12')).toBe(true);
        expect(TemplateFetch_1["default"].packageAndTplVersionOK('4.1.0', '4.0.12')).toBe(true);
    });
    it('Greater tagged tpl version should be false', function () {
        expect(TemplateFetch_1["default"].packageAndTplVersionOK('4.1.0', '4.1.2')).toBe(false);
    });
    it('Greater major version that tpl version should be false', function () {
        expect(TemplateFetch_1["default"].packageAndTplVersionOK('5.1.0', '4.1.2')).toBe(false);
    });
});
describe('semver check', function () {
    it('should return true', function () {
        expect(TemplateFetch_1["default"].isSemVer('1.0.0')).toBe(true);
        expect(TemplateFetch_1["default"].isSemVer('1.00')).toBe(true);
        expect(TemplateFetch_1["default"].isSemVer('1.1.0')).toBe(true);
        expect(TemplateFetch_1["default"].isSemVer('1.1.0-beta')).toBe(true);
    });
    it('should return false', function () {
        expect(TemplateFetch_1["default"].isSemVer('master')).toBe(false);
        expect(TemplateFetch_1["default"].isSemVer('develop')).toBe(false);
        expect(TemplateFetch_1["default"].isSemVer('feature/1.0.2')).toBe(false);
        expect(TemplateFetch_1["default"].isSemVer('1.00a')).toBe(false);
        expect(TemplateFetch_1["default"].isSemVer('100a')).toBe(false);
        expect(TemplateFetch_1["default"].isSemVer('a')).toBe(false);
    });
});
