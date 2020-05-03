export interface Operation {
  path_name?: string;
  path?: any;
  subresource?: string;
  channelDescription?: string;
  channelName?: string;
  channel?: any;
}

export type Operations = Operation[];

export interface OperationsContainer {
  [operationName: string]: Operations;
}
