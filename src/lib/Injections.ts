import { GIT_DIRECTORY } from '@/constants/CachePaths';
import { ConfigExtendedBase } from '@/interfaces';
import TemplateFetch from '@/lib/template/TemplateFetch';
import fs from 'fs-extra';
import * as walk from '@root/walk';
import path from 'path';

class Injections {
  /**
   * Based on the injections attribute of the nodegenrc file this will merge the injection
   * files into the template files of this run
   * @param extendedConfig
   * @return Full path to the new merged template directory, or, the original
   */
  async init (extendedConfig: ConfigExtendedBase): Promise<string> {
    // Return the original value of "templates" when no injections are present
    if (!extendedConfig.nodegenRc.injections || !extendedConfig.nodegenRc.injections.length) {
      return extendedConfig.templates;
    }

    const {injections} = extendedConfig.nodegenRc;

    // Before starting, we need a folder for the merged code to live
    const baseMerged = this.createBaseMergeTemplateFolder(extendedConfig);

    // Iterate over each injection
    for (let i = 0; i < injections.length; i++) {

      // download the injections using the regular TemplateFetch class
      const templatesDir = await TemplateFetch.resolveTemplateType(
        injections[i].source,
        extendedConfig.targetDir,
        extendedConfig.dontUpdateTplCache
      );

      // Merge the injection tpl into the merge folder
      await this.mergeInjectionIntoBaseMergeFolder({
        target: extendedConfig.targetDir,
        mergeDir: baseMerged.subDir,
        gitOverwrite: templatesDir.replace(
          path.join(extendedConfig.targetDir, GIT_DIRECTORY),
          ''
        )
      });
    }

    return baseMerged.fullPath;
  }

  /**
   * The merged folder is simple copy of the primary template, the injection code will be written on top of its contents
   */
  createBaseMergeTemplateFolder (extendedConfig: ConfigExtendedBase): { fullPath: string, subDir: string } {
    const newDirParts = extendedConfig.templates.split('/');
    newDirParts[newDirParts.length - 1] += '_merged';
    const newDir = newDirParts.join('/');

    fs.copySync(extendedConfig.templates, newDir, {
      // do not copy over the .git folder
      filter: (src) => !src.includes('.git')
    });

    return {
      fullPath: newDir,
      subDir: newDirParts[newDirParts.length - 1]
    };
  }

  /**
   * Merging the injection on top of the merge folder, as this is run multiple time depending on the qty of injections
   * the order of the injections is important.
   */
  mergeInjectionIntoBaseMergeFolder (input: { target: string, gitOverwrite: string, mergeDir: string }): Promise<void> {
    const overwriteFrom = path.join(input.target, GIT_DIRECTORY, input.gitOverwrite);
    const mergeDir = path.join(input.target, GIT_DIRECTORY, input.mergeDir);

    return walk.walk(overwriteFrom, async (err: Error, fullPath: string, dirent: fs.Dirent) => {
      if (err) {
        throw err;
      }

      // don't copy the got folder or contents over
      if (fullPath.includes('.git')) {
        return;
      }

      const fullMergedPath = fullPath.replace(overwriteFrom, mergeDir);

      if (dirent.isFile()) {
        // Ensure the directory lives in the merged folder
        // This permits the author of the injection source to inject
        // totally new directories and files
        fs.ensureDirSync(
          path.dirname(
            fullMergedPath
          )
        );

        // copy the file over from the injection tpl
        // to the new merged
        fs.copyFileSync(
          fullPath,
          fullMergedPath
        );
      }
    });
  }
}

export default new Injections();
