import { GenerateOperationFileConfig } from '@/interfaces/GenerateOperationFileConfig';
import { NodegenRc } from '@/interfaces/NodegenRc';
import { Swagger } from '@/interfaces/Swagger';

export interface TemplateVariables {
  operation_name: string;
  fileType: string;
  config: GenerateOperationFileConfig;
  operations: any;
  nodegenRc: NodegenRc;
  swagger: Swagger;
  mockServer: boolean;
  verbose: boolean;
}
