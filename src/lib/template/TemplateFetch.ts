import { GIT_DIRECTORY } from '@/constants/CachePaths';
import camelCaseStringReplacement from '@/lib/helpers/camelCaseStringReplacement';
import commandRun from '@/lib/helpers/commandRun';
import isFileToIngore from '@/lib/helpers/isFileToIngore';
import * as walk from '@root/walk';
import 'colors';
import compareVersions from 'compare-versions';
import fs from 'fs-extra';
import path from 'path';

class TemplateFetchURL {
  public targetGitCacheDir: string;

  /**
   * Writes a gitnore file to the provided folder
   * Used to write a gitignore to the parent git folder.
   * @param writeToFolder
   */
  public writeGitIgnore (writeToFolder: string) {
    fs.ensureDirSync(writeToFolder);
    fs.writeFileSync(
      path.join(writeToFolder, '.gitignore'),
      `
./*
`
    );
  }

  /**
   * Returns the folder to store the git repos in
   * @param targetGitCacheDir
   */
  public getCacheFolder (targetGitCacheDir: string) {
    this.targetGitCacheDir = path.join(targetGitCacheDir, GIT_DIRECTORY);
    this.writeGitIgnore(this.targetGitCacheDir);
    return this.targetGitCacheDir;
  }

  /**
   * Generates a cache directory relative to the url given
   * @param url
   * @param targetGitCacheDir
   * @return {string}
   */
  public calculateLocalDirectoryFromUrl (url: string, targetGitCacheDir: string) {
    const camelCaseUrl = camelCaseStringReplacement(url, ['/', ':', '.', '-', '?', '#']);
    return path.join(this.getCacheFolder(targetGitCacheDir), camelCaseUrl);
  }

  /**
   * Deletes the entire cache directory
   */
  public cleanSingleCacheDir (cachePath: string) {
    if (!cachePath.includes(this.targetGitCacheDir)) {
      console.error('For safety all folder removals must live within node_modules of this package.');
      console.error(
        'An incorrect cache folder path has been calculated, aborting! Please report this as an issue on gitHub.'
      );
      throw new Error('Aborting openapi-nodegen, see above comments.');
    }
    console.log('Removing the cacheDir: ' + cachePath);
    fs.removeSync(cachePath);
  }

  /**
   * Throws an error if gitFetch is not installed
   * @return {Promise<boolean>}
   */
  public async hasGit () {
    try {
      await commandRun('git', ['--help']);
      return true;
    } catch (e) {
      console.error('No gitFetch cli found on this operating system');
      return false;
    }
  }

  /**
   * Runs a simple cache exists on the proposed local file path
   * @param cachePath
   * @return {boolean}
   */
  public gitCacheExists (cachePath: string) {
    console.log('Checking for path: ' + cachePath);
    return fs.existsSync(cachePath);
  }

  public extractTagOrBranch (url: string) {
    const parts = url.split('#');
    if (parts.length === 1) {
      return 'default';
    }
  }

  /**
   * Fetches the contents of a gitFetch url to the local cache
   * @param {string} url - Url to fetch via gitFetch
   * @param targetGitCacheDir
   * @param dontUpdateTplCache
   * @return {Promise<string>}
   */
  public async gitFetch (url: string, targetGitCacheDir: string, dontUpdateTplCache: boolean) {
    if (!(await this.hasGit())) {
      throw new Error('Could not fetch cache from gitFetch url as gitFetch is not locally installed');
    }
    const cacheDirectory = this.calculateLocalDirectoryFromUrl(url, targetGitCacheDir);
    const urlParts = this.getUrlParts(url);
    if (this.gitCacheExists(cacheDirectory) && dontUpdateTplCache) {
      console.log('Template cache already found and bypass update true: ' + url);
      return cacheDirectory;
    }
    if (dontUpdateTplCache) {
      console.log('dontUpdateTplCache was true however the cache of the templates did not already exist.');
    }
    try {
      if (this.gitCacheExists(cacheDirectory) && !urlParts.b) {
        await this.gitPull(cacheDirectory);
      } else {
        this.cleanSingleCacheDir(cacheDirectory);
        await this.gitClone(urlParts.url, cacheDirectory, urlParts.b);
      }
    } catch (e) {
      console.error('Could not clone or pull the given git repository!');
      this.cleanSingleCacheDir(cacheDirectory);
      throw e;
    }
    return cacheDirectory;
  }

  /**
   * Changes directory then pulls an expected git repo
   * @param cacheDirectory
   * @return {Promise<boolean>}
   */
  public async gitPull (cacheDirectory: string) {
    const cwd = process.cwd();
    process.chdir(cacheDirectory);
    try {
      console.log('Updating git cache');
      await commandRun('git', ['pull'], true);
      process.chdir(cwd);
      await this.logTagWarning(cacheDirectory);
      return true;
    } catch (e) {
      process.chdir(cwd);
      throw e;
    }
  }

  /**
   * Logs the tpl tag and warns
   */
  public async logTagWarning (cacheDirectory: string, tagBranch?: string) {
    // If a branch or tag was given, only continue if it is a semver and
    // not a branch thus allowing testing of develop / feature branches
    if (tagBranch && !this.isSemVer(tagBranch)) {
      return;
    }
    const pkVersion = require('../../../package.json').version;
    const tplTag = tagBranch || (await this.getTplTag(cacheDirectory));
    if (!this.packageAndTplVersionOK(pkVersion, tplTag)) {
      console.log('IMPORTANT! There is a genetate-it & template tagged version error.'.red.bold);
      console.log(
        `
The` +
          `generate-it`.bold +
          `version must be greater or equal to the semver of the template tag but within the same major version.
You are currently using the following version:
generate-it: ${pkVersion}
template version tag: ${tplTag}
`
      );

      console.log('Aborting'.red.bold);
      process.exit(0);
    }
  }

  /**
   * Checks the input is a valid semantic version string
   * @param input
   */
  public isSemVer (input: string): boolean {
    const semver = /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;
    return semver.test(input);
  }

  /**
   * Returns the last tag from a given git repo
   * @param cacheDirectory - The git directory
   */
  public async getTplTag (cacheDirectory: string): Promise<string> {
    const cwd = process.cwd();
    process.chdir(cacheDirectory);
    const tag = await commandRun('git', ['describe', '--abbrev=0', '--tags']);
    process.chdir(cwd);
    return tag.outputString.trim();
  }

  /**
   * Ensure the current version and tpl tag semver will work together
   * @param packageVersion
   * @param tplTag
   */
  public packageAndTplVersionOK (packageVersion: string, tplTag: string) {
    // simple check on the major versions only.. ie the 1st char of the string
    if (Number(packageVersion[0]) > Number(tplTag[0])) {
      return false;
    }
    return compareVersions(packageVersion, tplTag) >= 0;
  }

  /**
   * Clones a remote git url to a given local directory
   * @param url
   * @param cacheDirectory
   * @param gitBranchOrTag
   * @return {Promise<*>}
   */
  public async gitClone (url: string, cacheDirectory: string, gitBranchOrTag?: string) {
    console.log(cacheDirectory);
    console.log('Clone git repository');
    fs.ensureDirSync(cacheDirectory);
    if (gitBranchOrTag) {
      await commandRun('git', ['clone', '-b', gitBranchOrTag, url, cacheDirectory], true);
    } else {
      await commandRun('git', ['clone', url, cacheDirectory], true);
    }
    await this.logTagWarning(cacheDirectory);
  }

  /**
   *
   * @param {string} url
   * @return {{b: string, url: string}}
   */
  public getUrlParts (url: string): { url: string; b?: string } {
    let cloneUrl = url;
    let b;
    if (url.includes('#')) {
      const parts = url.split('#');
      cloneUrl = parts[0];
      b = parts[1];
    }
    return {
      url: cloneUrl,
      b,
    };
  }

  /**
   * Copy folder structure from src to dest
   * @param src
   * @param dest
   */
  public copyRecursive (src: string, dest: string) {
    if (!src.endsWith('/')) {
      src += '/';
    }
    if (!dest.endsWith('/')) {
      dest += '/';
    }
    return walk.walk(src, async (err: Error, fullpath: string, dirent: fs.Dirent) => {
      if (err) {
        throw err;
      }
      if (isFileToIngore(fullpath, dirent.name)) {
        return Promise.resolve(false);
      }

      const outpath = fullpath.replace(src, dest);
      if (dirent.isDirectory()) {
        fs.ensureDirSync(outpath);
      } else {
        fs.copyFile(fullpath, outpath);
      }
    });
  }

  /**
   * Use local folders
   * @param url - path to template source dir
   * @param targetGitCacheDir
   * @param dontUpdateTplCache
   * @return {Promise<string>}
   */
  public async localDirectoryCopy (url: string, targetGitCacheDir: string, dontUpdateTplCache: boolean) {
    const cacheDirectory = this.calculateLocalDirectoryFromUrl(url, targetGitCacheDir);
    const urlParts = this.getUrlParts(url);

    if (this.gitCacheExists(cacheDirectory) && dontUpdateTplCache) {
      console.log('Template cache already found and bypass update true: ' + url);
      return cacheDirectory;
    }
    if (dontUpdateTplCache) {
      console.log('dontUpdateTplCache was true however the cache of the templates did not already exist.');
    }

    try {
      if (this.gitCacheExists(cacheDirectory)) {
        this.cleanSingleCacheDir(cacheDirectory);
      }
      await this.copyRecursive(url, cacheDirectory);
    } catch (e) {
      console.error('Could not copy the folders!');
      this.cleanSingleCacheDir(cacheDirectory);
      throw e;
    }
    return cacheDirectory;
  }

  /**
   * Returns local helpers name or full path to cached directory
   * @param {string} input - Either es6 | typescript | https github url |
   *                        local directory relative to where this package is called from
   * @param targetGitCacheDir
   * @param dontUpdateTplCache
   * @return {Promise<string>} - Returns the full path on the local drive to the tpl directory.
   */
  public async resolveTemplateType (input: string, targetGitCacheDir: string, dontUpdateTplCache: boolean) {
    if (input.substring(0, 8) === 'https://') {
      return await this.gitFetch(input, targetGitCacheDir, dontUpdateTplCache);
    } else if (fs.existsSync(path.resolve(input))) {
      return await this.localDirectoryCopy(input, targetGitCacheDir, dontUpdateTplCache);
    } else {
      throw new Error('The provided helpers argument must be a valid https url');
    }
  }
}

export default new TemplateFetchURL();
