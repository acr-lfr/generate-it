import path from 'path';
import openapiNodegen from '@/generateIt';
import { tplUrl, tplClientServer, clearTestServer } from './helpers';

jest.setTimeout(60 * 1000); // in milliseconds
const testServerPath = path.join(process.cwd(), 'test_server_client');
const testClientPath = path.join(testServerPath, 'src/services/openweathermap');
const ymlPath = path.join(process.cwd(), 'test_swagger.yml');

describe('e2e testing', () => {
  beforeAll(() => {
    clearTestServer();
  });
  afterAll(() => {
    // clearTestServer();
  });

  it('Should build without error', async (done) => {
    try {
      await openapiNodegen({
        dontRunComparisonTool: true,
        dontUpdateTplCache: true,
        mockServer: false,
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

  it('Should build the client', async (done) => {
    try {
      await openapiNodegen({
        dontRunComparisonTool: true,
        dontUpdateTplCache: true,
        mockServer: false,
        segmentsCount: 1,
        swaggerFilePath: ymlPath,
        targetDir: testClientPath,
        template: tplClientServer,
      });
      done();
    } catch (e) {
      done(e);
    }
  });
});
