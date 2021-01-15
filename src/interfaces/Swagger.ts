import * as Schema from 'swagger-schema-official';

export interface Swagger extends Schema.Spec {
  channels: {
    [pathName: string]: Channel;
  };
  endpoints: {};
  groupNamesWithFirstUrlSegment: {};
  paths: {
    [pathName: string]: Path;
  };
}

export interface Channel {
  publish: {
    operationId: string;
  };
  subscribe: {
    operationId: string;
  };
}

export interface Path extends Schema.Path {
  groupName: string;
  tags?: string[];
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
}

export interface Operation extends Schema.Operation {
  path?: Path;
  path_name?: string;
  subresource?: string;
  channelDescription?: string;
  channelName?: string;
  channel?: any;
}

export type Operations = Operation[];

export interface OperationsContainer {
  [operationName: string]: Operations;
}

export { Schema };
