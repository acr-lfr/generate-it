import fs from 'fs';
import path from 'path';
import openapiNodegen from '@/generateIt';
import { tplUrl, tplClientServer, clearTestServer } from './helpers';

jest.setTimeout(60 * 1000); // in milliseconds
const dirName = 'test_server_client';
const testServerPath = path.join(process.cwd(), dirName);
const testClientPath = path.join(testServerPath, 'src/services/openweathermap');
const ymlPath = path.join(process.cwd(), 'test_swagger.yml');

describe('e2e testing', () => {
  beforeAll(() => {
    clearTestServer(dirName);
  });
  afterAll(() => {
    clearTestServer(dirName);
  });

  it('Should build without error', async (done) => {
    try {
      await openapiNodegen({
        dontRunComparisonTool: true,
        dontUpdateTplCache: true,
        mockServer: false,
        segmentFirstGrouping: 1,
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
        segmentFirstGrouping: 1,
        swaggerFilePath: ymlPath,
        targetDir: testClientPath,
        template: tplClientServer,
      });
      done();
    } catch (e) {
      done(e);
    }
  });
  it('should edit the client, regen and see the edit still present', async () => {
    const checkPath = path.join(testClientPath, 'lib/HttpService.ts');
    fs.writeFileSync(checkPath, '//', 'utf8');
    await openapiNodegen({
      dontRunComparisonTool: true,
      dontUpdateTplCache: true,
      mockServer: false,
      segmentFirstGrouping: 1,
      swaggerFilePath: ymlPath,
      targetDir: testClientPath,
      template: tplClientServer,
    });
    const templateStr = fs.readFileSync(checkPath).toString('utf8');
    expect(templateStr).toBe('//');
  });
});
