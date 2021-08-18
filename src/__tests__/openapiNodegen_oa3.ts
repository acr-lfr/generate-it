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
        updateDependenciesFromTpl: false,
        mockServer: true,
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
      // Check domains (STUB file)
      [
        'test_server/src/domains/domainsImporter.ts',
        'f320fd1f45c82774fce9cf19e42cd0a5',
      ],
      [
        'test_server/src/domains/WeatherDomain.ts',
        '30efe49b22921328e0be1ddc5c3e17a4',
      ],
      // Check complex interface (INTERFACE file)
      [
        'test_server/src/http/nodegen/interfaces/WeatherFull.ts',
        '3b5de54103373a6f2e1d6945c0c1c66e',
      ],
      // Check the interface index file (OTHER file)
      [
        'test_server/src/http/nodegen/interfaces/index.ts',
        '0a4658f2480054f9a3a416f358deee2f',
      ],
      // Check the security definition files (OTHER file)
      [
        'test_server/src/http/nodegen/security/definitions.ts',
        '6b25d2dcc74702d6fa231ea3719eefa2',
      ],
      // Check the rabbitMQ routes files (OPERATION file)
      [
        'test_server/src/http/nodegen/routes/rainRoutes.ts',
        '18d92a00b90852ff39e7cac9fff9aa8d',
      ],
      [
        'test_server/src/http/nodegen/routes/weatherRoutes.ts',
        'e2f5987fd26f02a201e9bdcba6edf06c',
      ],
      // Check the output transformers (OPERATION file)
      [
        'test_server/src/http/nodegen/transformOutputs/weatherTransformOutput.ts',
        '4aa51bd321328186343834ac287f1cca',
      ],
      // Check dynamic docker file (OTHER file)
      ['test_server/docker-compose.yml', '779fd3809240f10dd84c8c070f0851d3'],
      // Check git ignore was copied over (OTHER file)
      // Check the deleted service file was reinjected
      [
        'test_server/src/services/HttpHeadersCacheService.ts',
        '2498e94e30b5e52f912ea8877573f889',
      ],
    ];
    const mismatched: string[] = [];
    for (let i = 0; i < expectedPathHashes.length; ++i) {
      const filePath = expectedPathHashes[i][0];
      const fileHash = expectedPathHashes[i][1];
      const hash = await hasha.fromFile(path.join(process.cwd(), filePath), {
        algorithm: 'md5',
      });
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
