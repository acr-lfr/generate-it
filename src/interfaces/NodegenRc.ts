export default interface NodegenRc {
  nodegenDir: string;
  nodegenMockDir?: string;
  nodegenType: string;
  interfaceStyle?: string;
  helpers?: {
    operationNames?: {
      include?: string[],
      exclude?: string[],
    },
    [helperName: string]: any
  };
}
