export interface Helpers {
  publishOpIds?: string[],
  subscribeOpIds?: string[],

  [helperName: string]: any
}

export interface InjectionOverwrites {
  targetDir: string,
  url: string
}

export interface NodegenRc {
  nodegenDir: string;
  nodegenMockDir?: string;
  nodegenType: string;
  interfaceStyle?: string;
  segmentFirstGrouping?: number;
  segmentSecondGrouping?: number;
  helpers?: Helpers;
  injectionOverwrites?: InjectionOverwrites[];
}
