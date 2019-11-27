import fs from 'fs-extra';
import path from 'path';
import walk from 'walk';

import ConfigExtendedBase from '@/interfaces/ConfigExtendedBase';
import FileTypeCheck from '@/lib/FileTypeCheck';
import generateFile from '@/lib/generateFile';
import GenerateInterfaceFiles from '@/lib/GenerateInterfaceFiles';
import generateOperationFile from '@/lib/generateOperationFile';
import generateOperationFiles from '@/lib/generateOperationFiles';
import isFileToIngore from '@/lib/isFileToIngore';

class FileWalker {
  public files: any = {};
  public config: ConfigExtendedBase;
  public isFirstRun: boolean;

  /**
   * Walks over the file system compiling tpl files with the config data
   * @param {boolean} providedIsFirstRun
   * @param {object} providedConfig
   * @return {Promise<>}
   */
  public walk (providedIsFirstRun: boolean, providedConfig: ConfigExtendedBase) {
    this.config = providedConfig;
    this.isFirstRun = providedIsFirstRun;
    const targetDir = this.config.targetDir;
    const templatesDir = this.config.templates;
    fs.copySync(this.config.swaggerFilePath, path.resolve(targetDir, 'dredd', 'swagger.yml'));
    return new Promise((resolve, reject) => {
      walk.walk(templatesDir, {
        followLinks: false,
      }).on('file', async (root: string, stats: any, next: any) => {
        try {
          await this.fileIteration(root, stats, next);
        } catch (e) {
          console.error(e)
        }
      })
      // @ts-ignore
        .on('errors', (root: any, nodeStatsArray: any) => {
          reject(nodeStatsArray);
        })
        .on('end', async () => {
          await this.parseOpIndex();
          resolve();
        });
    });
  }

  /**
   * Generates the opIndex tpl file
   * @return {Promise<void>}
   */
  public async parseOpIndex () {
    if (this.files[FileTypeCheck.OPERATION_INDEX]) {
      await generateOperationFile(
        this.files[FileTypeCheck.OPERATION_INDEX].generationDataObject,
        [],
        'index',
        true,
        {
          operationFiles: this.files[FileTypeCheck.OPERATION].files,
        },
      );
    }
  }

  /**
   * The walker function for a single file
   * @param {string} root - The directory to the file
   * @param {string} stats - The name of the file
   * @param {function} next - The callback function to continue
   * @return {Promise<void>}
   */
  public async fileIteration (root: string, stats: any, next: any) {
    if (isFileToIngore(root, stats.name)) {
      return next();
    }
    global.veryVerboseLogging('Dir:' + root);
    global.veryVerboseLogging('File:' + stats.name);
    const targetDir = this.config.targetDir;
    const templatesDir = this.config.templates;
    const templatePath = path.resolve(targetDir, path.relative(templatesDir, path.resolve(root, stats.name)));
    const generationDataObject = {
      root,
      templates_dir: templatesDir,
      targetDir,
      package: this.config.package,
      data: this.config,
      file_name: stats.name,
      segmentsCount: this.config.segmentsCount,
      mockServer: this.config.mockServer,
    };
    const fileType = FileTypeCheck.getFileType(generationDataObject.file_name);
    if (fileType === FileTypeCheck.INTERFACE) {
      global.veryVerboseLogging('Interface file: ' + generationDataObject.file_name);
      // iterates over the interfaces array in the swagger object creating multiple interface files
      await (new GenerateInterfaceFiles(generationDataObject)).writeFiles();

    } else if (
      (this.config.mockServer && fileType === FileTypeCheck.MOCK) ||
      fileType === FileTypeCheck.STUB || fileType === FileTypeCheck.OPERATION
    ) {
      global.veryVerboseLogging('Mock|Stub|Operation file: ' + generationDataObject.file_name);
      // this file should be handled for each in swagger.paths creating multiple path based files, eg domains or routes etc etc
      this.files[fileType] = {
        files: await generateOperationFiles(generationDataObject),
        generationDataObject,
      };
    } else if (fileType === FileTypeCheck.OPERATION_INDEX) {
      this.files[fileType] = {
        generationDataObject,
      };
    } else if (fileType === FileTypeCheck.OTHER) {
      // standard tpl file, no iterations, simple parse with the generationDataObject
      await generateFile(generationDataObject, this.isFirstRun);
    }
    if (templatePath.substr(templatePath.length - 3) === 'njk') {
      fs.removeSync(templatePath);
    }
    global.veryVerboseLogging(root);
    next();
  }
}

export default new FileWalker();
