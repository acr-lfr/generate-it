import { ConfigExtendedBase } from '@/interfaces';

export const mockConfig: ConfigExtendedBase = {
  swaggerFilePath: '',
  targetDir: '',
  template: 'Test',
  dontUpdateTplCache: false,
  dontRunComparisonTool: false,
  updateDependenciesFromTpl: false,
  mockServer: false,
  nodegenRc: {
    nodegenDir: 'src/http',
    nodegenMockDir: 'src/domains/__mocks__',
    nodegenType: 'server'
  }
};
