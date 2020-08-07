import fs from 'fs-extra';
import path from 'path';
import walk from 'walk';

import ConfigExtendedBase from '@/interfaces/ConfigExtendedBase';
import FileTypeCheck from '@/lib/FileTypeCheck';
import generateFile from '@/lib/generate/generateFile';
import GenerateInterfaceFiles from '@/lib/generate/GenerateInterfaceFiles';
import isFileToIngore from '@/lib/helpers/isFileToIngore';
import GenerateOperation from '@/lib/generate/GenerateOperation';

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
    const templatesDir = this.config.templates;
    return new Promise((resolve, reject) => {
      walk.walk(templatesDir, {
        followLinks: false,
      }).on('file', async (root: string, stats: any, next: any) => {
        try {
          await this.fileIteration(root, stats, next);
        } catch (e) {
          console.error(e);
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
      await GenerateOperation.file(
        this.files[FileTypeCheck.OPERATION_INDEX].generationDataObject,
        [],
        'index',
        FileTypeCheck.OPERATION_INDEX,
        true,
        {
          operationFiles: this.files[FileTypeCheck.OPERATION].files,
        },
      );
    }
  }

  public calculateTemplatePath (dir: string, filename: string): string {
    return path.resolve(
      this.config.targetDir,
      path.relative(
        this.config.templates,
        path.resolve(
          dir,
          filename,
        ),
      ),
    );
  }

  public buildPathDataObject (root: string, filename: string) {
    return {
      root,
      templates_dir: this.config.templates,
      targetDir: this.config.targetDir,
      package: this.config.package,
      data: this.config,
      file_name: filename,
      segmentFirstGrouping: this.config.segmentFirstGrouping,
      mockServer: this.config.mockServer,
    };
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

    const templatePath = this.calculateTemplatePath(root, stats.name);
    const generationDataObject = this.buildPathDataObject(root, stats.name);
    const fileType = FileTypeCheck.getFileType(generationDataObject.file_name);

    switch (fileType) {
      case FileTypeCheck.INTERFACE:
        await (new GenerateInterfaceFiles(generationDataObject)).writeFiles();
        break;
      case FileTypeCheck.OTHER:
        await generateFile(generationDataObject, this.isFirstRun, {}, this.config.nodegenRc.nodegenDir);
        break;
      case FileTypeCheck.OPERATION_INDEX:
        this.files[fileType] = {generationDataObject};
        break;
    }

    if ((this.config.mockServer && fileType === FileTypeCheck.MOCK) || fileType === FileTypeCheck.STUB || fileType === FileTypeCheck.OPERATION) {
      this.files[fileType] = {
        files: await GenerateOperation.files(generationDataObject, fileType),
        generationDataObject,
      };
    }

    if (templatePath.substr(templatePath.length - 3) === 'njk') {
      fs.removeSync(templatePath);
    }
    global.veryVerboseLogging(root);
    next();
  }
}

export default new FileWalker();
