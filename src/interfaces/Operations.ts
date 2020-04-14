export interface Operation {
  path_name?: string;
  path?: any;
  subresource?: string;
  channel_name?: string;
  channel?: any;
}

export type Operations = Operation[]

export interface OperationsContainer {
  [operationName: string]: Operations
}
