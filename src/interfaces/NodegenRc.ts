enum nodegenType {
  Server = 'server',
  Client = 'client',
}
export default interface NodegenRc {
  'nodegenDir': string;
  'nodegenMockDir': string;
  'nodegenType': nodegenType;
  interfaceStyle?: string;
}
