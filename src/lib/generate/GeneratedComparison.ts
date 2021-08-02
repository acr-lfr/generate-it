import 'colors';
import fs from 'fs-extra';
import path from 'path';

import consoleHorizontalRule from '@/lib/helpers/consoleHorizontalRule';
import fileDiff from '@/lib/diff/fileDiff';
import { COMPARE_DIRECTORY, MAX_CACHE_COUNT } from '@/constants/CachePaths';

class GeneratedComparison {
  public getCacheBaseDir (targetParentDirectory: string) {
    return path.join(targetParentDirectory, COMPARE_DIRECTORY);
  }

  /**
   * Retutns a path to the config cache compare dir
   * @param {string} targetParentDirectory - The
   * @return {string}
   */
  public getCacheCompareConfigPath (targetParentDirectory: string): string {
    return path.join(this.getCacheBaseDir(targetParentDirectory), 'config.json');
  }

  /**
   * fetch the config json from the compare dir
   * @param jsonFilePath
   * @return {{versions: {}}}
   */
  public getCacheCompareJson (jsonFilePath: string): any {
    let json;
    if (fs.pathExistsSync(jsonFilePath)) {
      json = fs.readJsonSync(jsonFilePath);
    } else {
      json = {
        versions: {},
      };
    }
    return json;
  }

  /**
   * Ensures the compare dir exists and returns its path
   * @param targetParentDirectory
   * @return {string}
   */
  public getCompareDirectory (targetParentDirectory: string) {
    const compareDir = path.join(targetParentDirectory, COMPARE_DIRECTORY);
    fs.ensureDirSync(compareDir);
    return compareDir;
  }

  /**
   *
   * @param targetParentDirectory
   * @return {Promise<string|*>}
   */
  public async fileDiffs (targetParentDirectory: string): Promise<any> {
    const json = this.getCacheCompareJson(this.getCacheCompareConfigPath(targetParentDirectory));

    const versions = Object.keys(json.versions).sort();
    if (versions.length <= 1) {
      console.log('No previous files to compare from, a diff comparison chart will be available after the next generation.');
      return '';
    }

    const newVersionKey = versions.pop();
    const oldVersionKey = versions.pop();

    for (const directory of Object.keys(json.versions[newVersionKey])) {
      if (!json.versions[oldVersionKey][directory]) {
        return;
      }

      const oldFilePath = path.join(directory, oldVersionKey);
      const newFilePath = path.join(directory, newVersionKey);
      json.versions[newVersionKey][directory].diff = await fileDiff(oldFilePath, newFilePath);
    }

    return json.versions[newVersionKey];
  }

  /**
   * Console logs a table of file diffs
   * @param outputDir
   * @param input
   */
  public fileDiffsPrint (outputDir: string, input: any): void {
    if (typeof input === 'string' && input !== '') {
      return console.log(input);
    }

    const buildDiff = (add: number, minus: number) => {
      return {
        added: add,
        removed: minus,
        message: add > 0 || minus > 0 ? 'Diff print in full above' : 'No differences',
      };
    };

    const logDiffs: Record<string, any> = {};
    const cacheCompareDir = this.getCompareDirectory(outputDir);

    Object.keys(input).forEach((key) => {
      const displayPath = key.replace(cacheCompareDir, '');

      if (input[key]?.diff?.difference?.length > 0) {
        console.log(consoleHorizontalRule());
        console.log('START' + displayPath.bold);
        console.log(input[key].diff.difference);
        console.log('END' + displayPath.bold);
        console.log(consoleHorizontalRule());
      }

      logDiffs[displayPath] = buildDiff(input[key].diff.plus, input[key].diff.minus);
    });
    console.table(logDiffs);
  }

  /**
   * Using the data in the config.json file, remove old cache files
   * If the system has files not registered in the config, these files will remain untouched.
   * @param targetParentDirectory
   */
  public versionCleanup (targetParentDirectory: string): void {
    const configPath = this.getCacheCompareConfigPath(targetParentDirectory);
    const json = this.getCacheCompareJson(configPath);
    const versions = Object.keys(json.versions).sort().reverse();
    if (versions.length >= MAX_CACHE_COUNT) {
      versions.forEach((version, i) => {
        if (i >= MAX_CACHE_COUNT) {
          const paths = Object.keys(json.versions[version]);
          paths.forEach((singlePath, j) => {
            paths[j] = path.join(singlePath, '/', version);
          });
          paths.forEach((singlePath) => {
            fs.removeSync(singlePath);
          });
          delete json.versions[version];
        }
      });
    }
    fs.writeJsonSync(configPath, json, {
      spaces: 2,
    });
  }

  /**
   * Compares the new content for the proposed stub file that already exists on the file system.
   * If there is not already a backup to compare, an error message is shown.
   * Once compared the new file contents are written to the backup location.
   * @param {string} targetFile - The target file the rendered content was destined for
   * @param {string} targetParentDirectory - The parent directory the output is destined for
   * @param {string} subDirectory - The sub-directory the target file was destined for
   * @param {string} newFilename - The new filename the output was for
   * @param {string} newFileString - The newly rendered content
   * @return {Promise<void>}
   */
  public async generateComparisonFile (
    targetFile: string,
    targetParentDirectory: string,
    subDirectory: string,
    newFilename: string,
    newFileString: string
  ): Promise<void> {
    const backupComparePath = path.join(this.getCompareDirectory(targetParentDirectory), subDirectory, newFilename);
    const backUpFile = path.join(backupComparePath, '/', global.startISOString);
    fs.ensureFileSync(backUpFile);
    fs.ensureDirSync(backupComparePath);
    this.addToCacheComparisonReport(this.getCacheCompareConfigPath(targetParentDirectory), backupComparePath, global.startISOString);
    return fs.writeFileSync(backUpFile, newFileString, 'utf8');
  }

  /**
   * Adds a new path to the current cache comparison json
   * @param {string} jsonFilePath - Path to the json config file
   * @param {string} backupComparePath - Path to add
   * @param {string} isoTimstamp - Current runtime timestamp
   * @return {void}
   */
  public addToCacheComparisonReport (jsonFilePath: string, backupComparePath: string, isoTimstamp: string): void {
    const json = this.getCacheCompareJson(jsonFilePath);
    if (!json.versions[isoTimstamp]) {
      json.versions[isoTimstamp] = {};
    }
    if (!json.versions[isoTimstamp][backupComparePath]) {
      json.versions[isoTimstamp][backupComparePath] = {
        diff: '',
      };
    }
    fs.writeJsonSync(jsonFilePath, json, {
      spaces: 2,
    });
  }
}

export default new GeneratedComparison();
