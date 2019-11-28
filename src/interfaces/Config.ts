export default interface Config {
  swaggerFilePath: string;
  targetDir: string;
  template: string;
  dontUpdateTplCache: boolean;
  segmentsCount: number;
  handlebars_helper?: any;
  ignoredModules?: string[];
  mockServer: boolean;
}
