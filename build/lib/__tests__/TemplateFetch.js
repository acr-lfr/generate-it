const TemplateFetch = require('../TemplateFetch');
const fs = require('fs-extra');
const repoUrl = 'https://github.com/acrontum/openapi-nodegen.git';
let camelCaseUrl = '';
describe('calculateLocalDirectoryFromUrl should return valid directory', () => {
    it('camelcase a url and map to directory', () => {
        const directory = TemplateFetch.calculateLocalDirectoryFromUrl(repoUrl);
        camelCaseUrl = process.cwd() + '/node_modules/openapi-nodegen/cache/httpsGithubComAcrontumOpenapiNodegenGit';
        expect(directory).toBe(camelCaseUrl);
    });
});
it('hasGit should not throw error', async () => {
    expect(await TemplateFetch.hasGit()).toBe(true);
});
// describe('Fetch remote gitFetch url over https', () => {
//
//   beforeAll(() => {
//     return TemplateFetch.cleanAllCache()
//   })
//
//   it('Should fetch a simple opensource url', async (next) => {
//     console.log(camelCaseUrl)
//     try {
//       await TemplateFetch.gitFetch(repoUrl)
//       expect(fs.existsSync(camelCaseUrl)).toBe(true)
//     } catch (e) {
//       console.log(e)
//       next(e)
//     }
//   })
// })
