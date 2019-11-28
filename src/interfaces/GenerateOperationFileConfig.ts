import ConfigExtendedBase from '@/interfaces/ConfigExtendedBase';
import { Package } from '@/interfaces/Package';

export default interface GenerateOperationFileConfig {
  root: any;
  templates_dir: string;
  targetDir: string;
  package: Package;
  data: ConfigExtendedBase;
  file_name: string;
  segmentsCount: number;
  mockServer: boolean;
}
