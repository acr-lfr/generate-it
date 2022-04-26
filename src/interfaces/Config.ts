export interface Config {
  verbose?: boolean;
  veryVerbose?: boolean;
  swaggerFilePath: string;
  targetDir: string;
  template: string;
  dontUpdateTplCache: boolean;
  dontRunComparisonTool: boolean;
  updateDependenciesFromTpl: boolean;
  segmentFirstGrouping?: number;
  segmentSecondGrouping?: number;
  handlebars_helper?: any;
  mockServer: boolean;
  variables?: any;
  renderOnlyExt?: string;
  dontPrettify?: boolean;
}
