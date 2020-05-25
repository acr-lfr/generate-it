export default interface NodegenRc {
  nodegenDir: string;
  nodegenMockDir?: string;
  nodegenType: string;
  interfaceStyle?: string;
  helpers?: {
    publishOpIds?: string[],
    subscribeOpIds?: string[],
    [helperName: string]: any
  };
}
