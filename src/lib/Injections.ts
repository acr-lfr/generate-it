import { GIT_DIRECTORY } from '@/constants/CachePaths';
import { ConfigExtendedBase } from '@/interfaces';
import TemplateFetch from '@/lib/template/TemplateFetch';
import fs from 'fs-extra';
import * as walk from '@root/walk';
import path from 'path';

class Injections {
  async go (extendedConfig: ConfigExtendedBase): Promise<void> {
    const {injectionOverwrites} = extendedConfig.nodegenRc;

    if (!extendedConfig.nodegenRc?.injectionOverwrites.length) {
      return;
    }

    const baseMerged = this.createBase(extendedConfig);

    for (let i = 0; i < injectionOverwrites.length; i++) {
      const injectionConfig = injectionOverwrites[i];
      // download the injections
      const templatesDir = await TemplateFetch.resolveTemplateType(
        injectionConfig.url,
        extendedConfig.targetDir,
        extendedConfig.dontUpdateTplCache
      );
      await this.mergeIntoMerged({
        target: extendedConfig.targetDir,
        mergeDir: baseMerged.subDir,
        gitOverwrite: templatesDir.replace(
          path.join(extendedConfig.targetDir, GIT_DIRECTORY),
          ''
        )
      });
    }
  }

  createBase (extendedConfig: ConfigExtendedBase): { fullPath: string, subDir: string } {
    const newDirParts = extendedConfig.template.split('/');
    newDirParts[newDirParts.length - 1] += '_merged';
    const newDir = newDirParts.join('/');
    fs.copySync(
      extendedConfig.template,
      newDir
    );
    return {
      fullPath: newDir,
      subDir: newDirParts[newDirParts.length - 1]
    };
  }

  mergeIntoMerged (input: { target: string, gitOverwrite: string, mergeDir: string }): Promise<void> {

    const overwriteFrom = path.join(
      input.target,
      GIT_DIRECTORY,
      input.gitOverwrite
    );

    const mergeDir = path.join(
      input.target,
      GIT_DIRECTORY,
      input.mergeDir
    );

    return walk.walk(overwriteFrom, async (err: Error, fullpath: string, dirent: fs.Dirent) => {
      if (err) {
        throw err;
      }

      const fullMergedPath = fullpath.replace(overwriteFrom, mergeDir);

      if (dirent.isFile()) {
        // ensure the directory lives in the merged folder
        fs.ensureDirSync(
          path.dirname(
            fullMergedPath
          )
        );

        // copy the file over
        fs.copyFileSync(
          fullpath,
          fullMergedPath
        );
      }
    });
  }
}

export default new Injections();
