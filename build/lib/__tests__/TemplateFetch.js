"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const TemplateFetch_1 = tslib_1.__importDefault(require("../TemplateFetch"));
const repoUrl = 'https://github.com/acrontum/openapi-nodegen.git';
let camelCaseUrl = '';
describe('calculateLocalDirectoryFromUrl should return valid directory', () => {
    it('camelcase a url and map to directory', () => {
        const tagertDir = path_1.default.join(process.cwd(), '/bob/');
        const directory = TemplateFetch_1.default.calculateLocalDirectoryFromUrl(repoUrl, tagertDir);
        camelCaseUrl = path_1.default.join(tagertDir, '/.openapi-nodegen/git/httpsGithubComAcrontumOpenapiNodegenGit');
        expect(directory).toBe(camelCaseUrl);
    });
});
it('hasGit should not throw error', async () => {
    expect(await TemplateFetch_1.default.hasGit()).toBe(true);
});
//# sourceMappingURL=TemplateFetch.js.map