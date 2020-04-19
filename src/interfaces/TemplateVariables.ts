import GenerateOperationFileConfig from '@/interfaces/GenerateOperationFileConfig';
import NodegenRc from '@/interfaces/NodegenRc';

export interface TemplateVariables {
  operation_name: string;
  fileType: string;
  config: GenerateOperationFileConfig;
  operations: any;
  nodegenRc: NodegenRc;
  swagger: any;
  mockServer: boolean;
  verbose: boolean;
}
