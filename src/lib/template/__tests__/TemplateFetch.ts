import path from 'path';
import TemplateFetch from '../TemplateFetch';
import fs from 'fs-extra';

const repoUrl = 'https://github.com/acrontum/openapi-nodegen.git';
let camelCaseUrl = '';

describe('calculateLocalDirectoryFromUrl should return valid directory', () => {
  it('camelcase a url and map to directory', () => {
    const targetDir = path.join(process.cwd(), '/bob/');
    const directory = TemplateFetch.calculateLocalDirectoryFromUrl(repoUrl, targetDir);
    camelCaseUrl = path.join(targetDir, '/.openapi-nodegen/git/httpsGithubComAcrontumOpenapiNodegenGit');
    expect(directory).toBe(camelCaseUrl);
    fs.removeSync(targetDir);
  });
});

it('hasGit should not throw error', async () => {
  expect(await TemplateFetch.hasGit()).toBe(true);
});

describe('Test packageAndTplVersionOK', () => {
  it('Matching tags should be true', () => {
    expect(TemplateFetch.packageAndTplVersionOK('4.1.0', '4.1.0')).toBe(true);
  });
  it('Greater minor or patch openapi version than tpl tag should be true', () => {
    expect(TemplateFetch.packageAndTplVersionOK('4.0.13', '4.0.12')).toBe(true);
    expect(TemplateFetch.packageAndTplVersionOK('4.1.0', '4.0.12')).toBe(true);
  });
  it('Greater tagged tpl version should be false', () => {
    expect(TemplateFetch.packageAndTplVersionOK('4.1.0', '4.1.2')).toBe(false);
  });
  it('Greater major version that tpl version should be false', () => {
    expect(TemplateFetch.packageAndTplVersionOK('5.1.0', '4.1.2')).toBe(false);
  });
});

describe('semver check', () => {
  it('should return true', () => {
    expect(TemplateFetch.isSemVer('1.0.0')).toBe(true);
    expect(TemplateFetch.isSemVer('1.00')).toBe(true);
    expect(TemplateFetch.isSemVer('1.1.0')).toBe(true);
    expect(TemplateFetch.isSemVer('1.1.0-beta')).toBe(true);
  });
  it('should return false', () => {
    expect(TemplateFetch.isSemVer('master')).toBe(false);
    expect(TemplateFetch.isSemVer('develop')).toBe(false);
    expect(TemplateFetch.isSemVer('feature/1.0.2')).toBe(false);
    expect(TemplateFetch.isSemVer('1.00a')).toBe(false);
    expect(TemplateFetch.isSemVer('100a')).toBe(false);
    expect(TemplateFetch.isSemVer('a')).toBe(false);
  });
});

describe('local folder structure', () => {
  const srcRoot = path.join(process.cwd(), '/bob');
  const testDir = path.join('one', 'two', 'three');
  const src = path.join(srcRoot, testDir);
  const dest = './.bob-out';

  afterAll(() => {
    fs.removeSync(srcRoot);
    fs.removeSync(dest);
  });

  it('accepts a local folder', async () => {
    fs.ensureDirSync(src);
    fs.writeJsonSync(path.join(src, 'test.json'), {hello: 'world'});

    const cacheDirectory = TemplateFetch.calculateLocalDirectoryFromUrl(srcRoot, dest);
    await TemplateFetch.resolveTemplateType(srcRoot, dest, false);
    const testFile = path.join(process.cwd(), cacheDirectory, testDir, 'test.json');
    expect(fs.existsSync(testFile)).toBe(true);
    expect(require(testFile).hello).toBe('world');
  });
});
