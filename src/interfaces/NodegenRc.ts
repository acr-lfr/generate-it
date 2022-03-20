export interface Helpers {
  publishOpIds?: string[];
  subscribeOpIds?: string[];

  [helperName: string]: any;
}

export interface Injection {
  destination?: string;
  source: string;
}

export interface NodegenRc {
  nodegenDir: string;
  nodegenMockDir?: string;
  nodegenType: string;
  interfaceStyle?: string;
  segmentFirstGrouping?: number;
  segmentSecondGrouping?: number;
  helpers?: Helpers;
  injections?: Injection[];
}
