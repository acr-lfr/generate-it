import commandRun from '@/lib/commandRun';
import fs from 'fs-extra';
import path from 'path';

import camelCaseStringReplacement from '@/lib/helpers/camelCaseStringReplacement';
import { GIT_DIRECTORY } from '@/constants/CachePaths';

class TemplateFetchURL {
  targetGitCacheDir: string;

  public getCacheFolder (targetGitCacheDir: string) {
    this.targetGitCacheDir = path.join(targetGitCacheDir, GIT_DIRECTORY);
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
      console.error('An incorrect cache folder path has been calculated, aborting! Please report this as an issue on gitHub.');
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
    return fs.existsSync(cachePath);
  }

  /**
   * Fetches the contents of a gitFetch url to the local cache
   * @param {string} url - Url to fetch via gitFetch
   * @param targetGitCacheDir
   * @return {Promise<string>}
   */
  public async gitFetch (url: string, targetGitCacheDir: string) {
    if (!await this.hasGit()) {
      throw new Error('Could not fetch cache from gitFetch url as gitFetch is not locally installed');
    }
    const cacheDirectory = this.calculateLocalDirectoryFromUrl(url, targetGitCacheDir);
    const urlParts = this.getUrlParts(url);
    try {
      if (this.gitCacheExists(cacheDirectory)) {
        if (urlParts.b) {
          this.cleanSingleCacheDir(cacheDirectory);
          await this.gitClone(url, cacheDirectory);
        } else {
          await this.gitPull(cacheDirectory);
        }
      } else {
        await this.gitClone(url, cacheDirectory);
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
      return true;
    } catch (e) {
      process.chdir(cwd);
      throw e;
    }
  }

  /**
   * Clones a remote git url to a given local directory
   * @param url
   * @param cacheDirectory
   * @return {Promise<*>}
   */
  public async gitClone (url: string, cacheDirectory: string) {
    console.log(cacheDirectory);
    console.log('Clone git repository');
    const urlParts = this.getUrlParts(url);
    if (urlParts.b) {
      return commandRun('git', ['clone', '-b', urlParts.b, urlParts.url, cacheDirectory], true);
    } else {
      return commandRun('git', ['clone', urlParts.url, cacheDirectory], true);
    }
  }

  /**
   *
   * @param {string} url
   * @return {{b: string, url: string}}
   */
  public getUrlParts (url: string): { url: string, b?: string } {
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
   * Returns local template name or full path to cached directory
   * @param {string} input - Either es6 | typescript | https github url |
   *                        local directory relative to where this package is called from
   * @param targetGitCacheDir
   * @return {Promise<string>} - Returns the full path on the local drive to the tpl directory.
   */
  public async resolveTemplateType (input: string, targetGitCacheDir: string) {
    if (input.substring(0, 8) === 'https://') {
      return await this.gitFetch(input, targetGitCacheDir);
    } else {
      throw new Error('The provided template argument must be a valid https url');
    }
  }
}

export default new TemplateFetchURL();
