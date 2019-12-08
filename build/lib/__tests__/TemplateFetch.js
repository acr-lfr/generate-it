"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var TemplateFetch_1 = tslib_1.__importDefault(require("../template/TemplateFetch"));
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
