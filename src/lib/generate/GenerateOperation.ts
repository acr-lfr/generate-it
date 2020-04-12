import GenerateOperationFileConfig from '@/interfaces/GenerateOperationFileConfig';
import _, { each } from 'lodash';
import generateSubresourceName from '@/lib/generate/generateSubresourceName';
import path from 'path';
import fs from 'fs-extra';
import NamingUtils from '@/lib/helpers/NamingUtils';
import TemplateRenderer from '@/lib/template/TemplateRenderer';
import FileTypeCheck from '@/lib/FileTypeCheck';
import GeneratedComparison from '@/lib/generate/GeneratedComparison';
import { TemplateVariables } from '@/interfaces/TemplateVariables';

class GenerateOperation {
  /**
   * Groups all http verbs for each path to then generate each operation file
   */
  public async files (config: GenerateOperationFileConfig, fileType: string) {
    const files: any = {};
    // Iterate over all path
    // pathProperties = all the http verbs and their contents
    // pathName = the full path after the basepath
    const iteratable = config.data.swagger.paths || config.data.swagger.channels;
    each(iteratable, (pathProperties, pathName) => {
      const operationName = pathProperties.endpointName;
      files[operationName] = files[operationName] || [];
      pathName = pathName.replace(/}/g, '').replace(/{/g, ':');
      files[operationName].push({
        path_name: pathName,
        path: pathProperties,
        subresource: generateSubresourceName(pathName, operationName),
      });
    });

    const filesKeys = Object.keys(files);
    for (let i = 0; i < filesKeys.length; ++i) {
      const operationNameItem = filesKeys[i];
      const operation = files[operationNameItem];
      await this.file(config, operation, operationNameItem, fileType);
    }
    return files;
  }

  /**
   * Generate an operation file
   * @param config
   * @param operation
   * @param operationName
   * @param fileType
   * @param verbose
   * @param additionalTplContent
   */
  public async file (
    config: GenerateOperationFileConfig,
    operation: any,
    operationName: string,
    fileType: string,
    verbose = false,
    additionalTplContent: any = {},
  ) {
    const filePath = path.join(config.root, config.file_name);
    const data = fs.readFileSync(filePath, 'utf8');
    const subDir = config.root.replace(new RegExp(`${config.templates_dir}[/]?`), '');
    const ext = NamingUtils.getFileExt(config.file_name);
    const newFilename = NamingUtils.fixRouteName(NamingUtils.generateOperationSuffix(subDir, operationName, ext));
    const targetFile = path.resolve(config.targetDir, subDir, newFilename);

    const renderedContent = TemplateRenderer.load(
      data.toString(),
      this.templateVariables(operationName, operation, config, additionalTplContent, verbose, fileType),
      ext,
    );

    if (FileTypeCheck.isStubFile(config.file_name) && fs.existsSync(targetFile)) {
      return await GeneratedComparison.generateComparisonFile(
        targetFile,
        config.targetDir,
        subDir,
        newFilename,
        renderedContent,
      );
    }
    return fs.writeFileSync(targetFile, renderedContent, 'utf8');
  }

  /**
   * Returns the template variables
   * @param operationName
   * @param operation
   * @param config
   * @param additionalTplContent
   * @param verbose
   * @param fileType
   */
  public templateVariables (
    operationName: string,
    operation: any,
    config: GenerateOperationFileConfig,
    additionalTplContent: any = {},
    verbose: boolean = false,
    fileType: string,
  ): TemplateVariables {
    return {
      operation_name: _.camelCase(operationName.replace(/[}{]/g, '')),
      fileType,
      config,
      operations: operation,
      swagger: config.data.swagger,
      mockServer: config.mockServer || false,
      verbose,
      ...additionalTplContent,
    };
  }
}

export default new GenerateOperation();
