import { Config } from '@/interfaces/Config';
import { NodegenRc } from '@/interfaces/NodegenRc';
import { Package } from '@/interfaces/Package';
import { Swagger } from '@/interfaces/Swagger';

export interface ConfigExtendedBase extends Config {
  nodegenRc?: NodegenRc;
  interfaceStyle?: string;
  templates?: string;
  swagger?: Swagger;
  package?: Package;
}
