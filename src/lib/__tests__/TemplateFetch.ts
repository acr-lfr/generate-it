import path from 'path';
import TemplateFetch from '../template/TemplateFetch';

const repoUrl = 'https://github.com/acrontum/openapi-nodegen.git';
let camelCaseUrl = '';

describe('calculateLocalDirectoryFromUrl should return valid directory', () => {
  it('camelcase a url and map to directory', () => {
    const tagertDir = path.join(process.cwd(), '/bob/');
    const directory = TemplateFetch.calculateLocalDirectoryFromUrl(repoUrl, tagertDir);
    camelCaseUrl = path.join(tagertDir, '/.openapi-nodegen/git/httpsGithubComAcrontumOpenapiNodegenGit');
    expect(directory).toBe(camelCaseUrl);
  });
});

it('hasGit should not throw error', async () => {
  expect(await TemplateFetch.hasGit()).toBe(true);
});
