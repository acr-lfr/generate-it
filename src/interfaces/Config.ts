export default interface Config {
  verbose?: boolean;
  veryVerbose?: boolean;
  swaggerFilePath: string;
  targetDir: string;
  template: string;
  dontUpdateTplCache: boolean;
  dontRunComparisonTool: boolean;
  segmentFirstGrouping?: number;
  handlebars_helper?: any;
  mockServer: boolean;
  variables?: any;
}
