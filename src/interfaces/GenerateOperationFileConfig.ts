import { ConfigExtendedBase } from '@/interfaces/ConfigExtendedBase';
import { Package } from '@/interfaces/Package';

export interface GenerateOperationFileConfig {
  root: any;
  templates_dir: string;
  targetDir: string;
  package: Package;
  data: ConfigExtendedBase;
  file_name: string;
  segmentFirstGrouping?: number;
  segmentSecondGrouping?: number;
  mockServer: boolean;
}
