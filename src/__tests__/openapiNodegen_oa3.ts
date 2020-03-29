import fs from 'fs-extra';
import path from 'path';
import openapiNodegen from '@/openapiNodegen';
import hasha from 'hasha';
import { clearTestServer, tplUrl } from '@/__tests__/openapiNodegen_full';

jest.setTimeout(60 * 1000); // in milliseconds

const testServerPath = path.join(process.cwd(), 'test_server');

describe('e2e testing', () => {
  beforeAll(() => {
    clearTestServer();
  });
  afterAll(() => {
    clearTestServer();
  });

  it('Should build without error', async (done) => {
    try {
      const ymlPath = path.join(process.cwd(), 'test_openapi3.yml');
      await openapiNodegen({
        dontRunComparisonTool: false,
        dontUpdateTplCache: true,
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

  it('Should have the correct file hashes', async (done) => {
    // If these tests fail the either:
    // A) The test_swagger.yml has changed
    // B) The tpl for the typescipt server has change
    // C) Something broke when building the said files
    const filePaths = [
      // Check generated domains (STUB file)
      ['test_server/src/domains/WeatherDomain.ts', 'e416a1329f114e95e8f5b553cf1066db'],
      // Check complex interface (INTERFACE file)
      ['test_server/src/http/nodegen/interfaces/WeatherPost.ts', 'fbe8cf7a8f93f34bb646d564223f854f'],
      // Check the interface index file (OTHER file)
      ['test_server/src/http/nodegen/interfaces/index.ts', 'ee8731ab790e96c6932df9cc71fe6c3a'],
      // Check the security definition files (OTHER file)
      ['test_server/src/http/nodegen/security/definitions.ts', '9fe31e21af71374e62bcb49bb2d40567'],
      // Check the generated routes files (OPERATION file)
      ['test_server/src/http/nodegen/routes/weatherRoutes.ts', 'bfdf9aa9054938cff8f6b2dcea7816dd'],
      // Check the output transformers (OPERATION file)
      ['test_server/src/http/nodegen/transformOutputs/weatherTransformOutput.ts', 'f1708e0d13ab42643a6a3a62b1652fd6'],
      // Check dynamic docker file (OTHER file)
      ['test_server/docker-compose.yml', '77046129af45b9b24ced9969ba669acd'],
      // Check git ignore was copied over (OTHER file)
      ['test_server/.gitignore', '7603a99efa78b3faf4ff493cf1cb0fb7'],
      // Check the deleted service file was reinjected
      ['test_server/src/services/HttpHeadersCacheService.ts', '144cd39920fd8e042a57f83628479979'],
    ];
    const mismatched: string[] = [];
    for (let i = 0; i < filePaths.length; ++i) {
      const filePath = filePaths[i][0];
      const fileHash = filePaths[i][1];
      const hash = await hasha.fromFile(path.join(process.cwd(), filePath), {algorithm: 'md5'});
      if (hash !== fileHash) {
        const wrong = `Hash mis-match for file ${filePath}. Expected hash ${fileHash} but got ${hash}`;
        mismatched.push(wrong);
      }
    }
    if (mismatched.length > 0) {
      console.log(mismatched);
      done(mismatched);
    } else {
      done();
    }
  });
});
