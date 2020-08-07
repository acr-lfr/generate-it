import path from 'path';
import openapiNodegen from '@/generateIt';
import hasha from 'hasha';

const {hashElement} = require('folder-hash');
import { clearTestServer } from './helpers';

jest.setTimeout(60 * 1000); // in milliseconds

const serverDir = 'test_asyncapi';
const testServerPath = path.join(process.cwd(), serverDir);
export const tplUrl = 'https://github.com/acrontum/generate-it-asyncapi-rabbitmq.git';
describe('e2e testing', () => {
  beforeAll(() => {
    clearTestServer(serverDir);
  });
  afterAll(() => {
    clearTestServer(serverDir);
  });

  it('Should build without error', async (done) => {
    try {
      const ymlPath = path.join(process.cwd(), 'test_asyncapi.yml');
      await openapiNodegen({
        dontRunComparisonTool: false,
        dontUpdateTplCache: true,
        mockServer: false,
        swaggerFilePath: ymlPath,
        targetDir: testServerPath,
        template: tplUrl,
      });
      done();
    } catch (e) {
      done(e);
    }
  });
  it('should return the correct hash for the domain folder', async () => {
    const options = {
      files: {include: ['*.ts']}
    };
    const hash = await hashElement(testServerPath, options);
    expect(hash.hash).toBe('+l0qbqc4Jbkw1LyBlZk3MKcHUK0=');
  });
});
