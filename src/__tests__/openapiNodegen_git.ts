import openapiNodegen from '@/generateIt';
import path from 'path';
import { clearTestServer, templates } from './helpers';

jest.setTimeout(60 * 1000); // in milliseconds

const testServerName = 'test_server_2';
const testServerPath = path.join(process.cwd(), testServerName);

describe('e2e testing', () => {
  beforeAll(() => {
    clearTestServer(testServerName);
  });

  afterAll(() => {
    clearTestServer(testServerName);
  });

  it('Should build without error', async (done) => {
    try {
      const ymlPath = path.join(process.cwd(), 'test_swagger.yml');
      await openapiNodegen({
        dontRunComparisonTool: false,
        dontUpdateTplCache: false,
        mockServer: true,
        swaggerFilePath: ymlPath,
        targetDir: testServerPath,
        template: templates.tsServerGit,
      });
      done();
    } catch (e) {
      done(e);
    }
  });
});
