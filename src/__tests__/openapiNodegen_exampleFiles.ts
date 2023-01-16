import fs from 'fs-extra';
import path from 'path';
import openapiNodegen from '@/generateIt';
import { clearTestServer, tplUrl } from './helpers';

jest.setTimeout(60 * 1000); // in milliseconds
const testServerPath = path.join(process.cwd(), 'test_server');
const swaggerFilePath = path.join(process.cwd(), 'test_swagger.yml');

describe('e2e testing for example files', () => {
  beforeAll(() => {
    clearTestServer();
  });
  afterAll(() => {
    clearTestServer();
  });

  const generateItConfig = {
    dontRunComparisonTool: false,
    dontUpdateTplCache: true,
    updateDependenciesFromTpl: false,
    mockServer: false,
    swaggerFilePath,
    targetDir: testServerPath,
    template: tplUrl,
    variables: {
      name: 'Generate-it Typescript Server'
    }
  };

  it('Build, delete the expected example file, regen, the example should stay dead.', async () => {
    await openapiNodegen(generateItConfig);
    const exampleFilePath = path.join(testServerPath, 'src/EXAMPLE_app.ts');
    fs.removeSync(exampleFilePath);
    await openapiNodegen(generateItConfig);
    expect(fs.pathExistsSync(exampleFilePath)).toBe(false);
  });
});
