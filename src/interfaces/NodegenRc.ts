export default interface NodegenRc {
  nodegenDir: string;
  nodegenMockDir?: string;
  nodegenType: string;
  interfaceStyle?: string;
  segmentFirstGrouping?: number;
  segmentSecondGrouping?: number;
  helpers?: {
    publishOpIds?: string[];
    subscribeOpIds?: string[];
    [helperName: string]: any;
  };
}
