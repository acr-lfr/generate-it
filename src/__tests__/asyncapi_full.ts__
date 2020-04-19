import path from 'path';
import openapiNodegen from '@/generateIt';
import { clearTestServer } from '@/__tests__/openapiNodegen_full';

jest.setTimeout(60 * 1000); // in milliseconds

const serverDir = 'test_asyncapi';
const testServerPath = path.join(process.cwd(), serverDir);
export const tplUrl = 'https://github.com/acrontum/generate-it-asyncapi-rabbitmq.git';
describe('e2e testing', () => {
  beforeAll(() => {
    clearTestServer(serverDir);
  });
  afterAll(() => {
    // clearTestServer();
  });

  it('Should build without error', async (done) => {
    try {
      const ymlPath = path.join(process.cwd(), 'test_asyncapi.yml');
      await openapiNodegen({
        dontRunComparisonTool: false,
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
});
