enum nodegenType {
  Server = 'server',
  Client = 'client',
}
enum stubChannelType {
  Publish = 'publish',
  Subscribe = 'subscribe',
}
export default interface NodegenRc {
  nodegenDir: string;
  nodegenMockDir?: string;
  nodegenType: nodegenType;
  interfaceStyle?: string;
  helpers?: {
    [helperName: string]: any
  };
  asyncApi?: {
    includedOperationIds?: string[];
    excludedOperationIds?: string[];
    stubChannelType: string[];
  };
}
