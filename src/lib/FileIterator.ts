import fs from 'fs-extra';
import path from 'path';
import * as walk from '@root/walk';

import { ConfigExtendedBase } from '@/interfaces/ConfigExtendedBase';
import FileTypeCheck from '@/lib/FileTypeCheck';
import generateFile from '@/lib/generate/generateFile';
import GenerateInterfaceFiles from '@/lib/generate/GenerateInterfaceFiles';
import isFileToIgnore from '@/lib/helpers/isFileToIgnore';
import GenerateOperation from '@/lib/generate/GenerateOperation';
import { GenerateOperationFileConfig } from '@/interfaces/GenerateOperationFileConfig';
import TemplateRenderer from '@/lib/template/TemplateRenderer';
import * as typescript from 'typescript';

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

    return walk.walk(templatesDir, async (err: Error, fullpath: string, dirent: fs.Dirent) => {
      if (err) {
        throw err;
      }
      if (isFileToIgnore(fullpath, dirent.name, providedConfig.nodegenRc)) {
        return Promise.resolve(false);
      }
      if (dirent.isDirectory()) {
        return;
      }

      const root = fullpath.slice(0, -dirent.name.length - 1);
      await this.fileIteration(root, dirent).catch(console.error);
    }).then(() => this.parseOpIndex());
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
    if (this.files[FileTypeCheck.EVAL]) {
      for (const ctx of this.files[FileTypeCheck.EVAL]) {
        const jsFilename: string = `${ctx.dest}${path.sep}___eval.js`;

        if (ctx.src.endsWith('.ts')) {
          const res = typescript.transpileModule(fs.readFileSync(ctx.src, 'utf8'), {});
          fs.removeSync(path.join(ctx.dest, '___eval.ts'));
          fs.writeFileSync(jsFilename, res.outputText);
        }

        await require(jsFilename).default(ctx);
        fs.removeSync(jsFilename);
      }
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

  public buildPathDataObject (root: string, filename: string): GenerateOperationFileConfig {
    return {
      root,
      templates_dir: this.config.templates,
      targetDir: this.config.targetDir,
      package: this.config.package,
      data: this.config,
      file_name: filename,
      segmentFirstGrouping: this.config.segmentFirstGrouping,
      segmentSecondGrouping: this.config.segmentSecondGrouping,
      mockServer: this.config.mockServer,
    };
  }

  /**
   * The walker function for a single file
   * @param {string} root - The directory to the file
   * @param {string} stats - The name of the file
   * @return {Promise<void>}
   */
  public async fileIteration (root: string, stats: any) {
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
      case FileTypeCheck.EXAMPLE:
        // Do nothing, an example file be injected by generateBaseStructure
        // Subsequent re-gens should not inject the file back into the file
        // system as the user may well have intentionally removed it
    }

    if ((this.config.mockServer && fileType === FileTypeCheck.MOCK) || fileType === FileTypeCheck.STUB || fileType === FileTypeCheck.OPERATION) {
      this.files[fileType] = {
        files: await GenerateOperation.files(generationDataObject, fileType),
        generationDataObject,
      };
    } else if (fileType === FileTypeCheck.EVAL) {
      this.files[fileType] = (this.files[fileType] || []).concat({
        ...generationDataObject.data,
        src: path.join(root, stats.name),
        dest: path.dirname(templatePath),
        root,
        filename: stats.name,
        TemplateRenderer,
      });
    }

    if (templatePath.substr(templatePath.length - 3) === 'njk') {
      fs.removeSync(templatePath);
    }
    global.veryVerboseLogging(root);
  }
}

export default new FileWalker();
