export default interface Config {
  verbose?: boolean;
  veryVerbose?: boolean;
  swaggerFilePath: string;
  targetDir: string;
  template: string;
  dontUpdateTplCache: boolean;
  dontRunComparisonTool: boolean;
  segmentsCount: number;
  handlebars_helper?: any;
  ignoredModules?: string[];
  mockServer: boolean;
}
