import { Config } from '@/interfaces/Config';
import { NodegenRc } from '@/interfaces/NodegenRc';
import { Package } from '@/interfaces/Package';

export interface ConfigExtendedBase extends Config {
  nodegenRc?: NodegenRc;
  interfaceStyle?: string;
  templates?: string;
  swagger?: any;
  package?: Package;
}
