import GenerateOperationFileConfig from '@/interfaces/GenerateOperationFileConfig';

export interface TemplateVariables {
  operation_name: string;
  fileType: string;
  config: GenerateOperationFileConfig;
  operations: any;
  swagger: any;
  mockServer: boolean;
  verbose: boolean;
}
