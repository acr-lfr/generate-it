import path from 'path';
import openapiNodegen from '@/generateIt';
import hasha from 'hasha';
import { clearTestServer, tplUrl } from '@/__tests__/helpers';

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
    const expectedPathHashes = [
      // Check generated domains (STUB file)
      ['test_server/src/domains/domainsImporter.ts', '8502ae153a067f2832b991a4b6b4812a'],
      ['test_server/src/domains/WeatherDomain.ts', '6f7097720b51eeb4b2bbd073aeb49111'],
      // Check complex interface (INTERFACE file)
      ['test_server/src/http/nodegen/interfaces/WeatherFull.ts', '3b5de54103373a6f2e1d6945c0c1c66e'],
      // Check the interface index file (OTHER file)
      ['test_server/src/http/nodegen/interfaces/index.ts', '9ad805ef48dbfb2cceb12626d7ecfafb'],
      // Check the security definition files (OTHER file)
      ['test_server/src/http/nodegen/security/definitions.ts', 'acb2aa134d1e8ac90765a24b367166ea'],
      // Check the generated routes files (OPERATION file)
      ['test_server/src/http/nodegen/routes/rainRoutes.ts', '18d92a00b90852ff39e7cac9fff9aa8d'],
      ['test_server/src/http/nodegen/routes/weatherRoutes.ts', '4c78b10fc990f7eb18886e1dac76f678'],
      // Check the output transformers (OPERATION file)
      ['test_server/src/http/nodegen/transformOutputs/weatherTransformOutput.ts', '4aa51bd321328186343834ac287f1cca'],
      // Check dynamic docker file (OTHER file)
      ['test_server/docker-compose.yml', '779fd3809240f10dd84c8c070f0851d3'],
      // Check git ignore was copied over (OTHER file)
      // Check the deleted service file was reinjected
      ['test_server/src/services/HttpHeadersCacheService.ts', '2498e94e30b5e52f912ea8877573f889'],
    ];
    const mismatched: string[] = [];
    for (let i = 0; i < expectedPathHashes.length; ++i) {
      const filePath = expectedPathHashes[i][0];
      const fileHash = expectedPathHashes[i][1];
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
