import { Config } from '@/interfaces/Config';
import { NodegenRc } from '@/interfaces/NodegenRc';
import { Package } from '@/interfaces/Package';
import { Swagger } from '@/interfaces/Swagger';


export type AsyncApi = Record<string, any>;

export interface ConfigExtendedBase extends Config {
  nodegenRc?: NodegenRc;
  interfaceStyle?: string;
  templates?: string;
  swagger?: Swagger | AsyncApi;
  package?: Package;
}
