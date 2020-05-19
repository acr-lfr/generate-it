import fs from 'fs-extra';
import path from 'path';
import openapiNodegen from '@/generateIt';

jest.setTimeout(60 * 1000); // in milliseconds

const testServerName = 'test_server_2';
const testServerPath = path.join(process.cwd(), testServerName);
export const tplUrl = 'https://github.com/acrontum/openapi-nodegen-typescript-server.git';

describe('e2e testing', () => {
  beforeAll(() => {
    fs.removeSync(testServerName);
  });
  afterAll(() => {
    fs.removeSync(testServerName);
  });

  it('Should build without error', async (done) => {
    try {
      const ymlPath = path.join(process.cwd(), 'test_swagger.yml');
      await openapiNodegen({
        dontRunComparisonTool: false,
        dontUpdateTplCache: false,
        mockServer: true,
        segmentsCount: 1,
        swaggerFilePath: ymlPath,
        targetDir: testServerPath,
        template: tplUrl,
      });
      done();
    } catch (e) {
      done(e);
    }
  });
});
