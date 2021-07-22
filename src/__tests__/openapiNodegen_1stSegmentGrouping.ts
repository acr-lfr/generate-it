import fs from 'fs-extra';
import path from 'path';
import openapiNodegen from '@/generateIt';
import hasha from 'hasha';
import { tplUrl, clearTestServer } from './helpers';

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
      const ymlPath = path.join(process.cwd(), 'test_swagger.yml');
      await openapiNodegen({
        dontRunComparisonTool: false,
        dontUpdateTplCache: true,
        updateDependenciesFromTpl: false,
        mockServer: true,
        segmentFirstGrouping: 1,
        swaggerFilePath: ymlPath,
        targetDir: testServerPath,
        template: tplUrl,
        variables: {
          name: 'Generate-it Typescript Server'
        }
      });
      done();
    } catch (e) {
      done(e);
    }
  });

  it('Should build again without error on top of the existing generation', async (done) => {
    try {
      // remove a survive file which should then be copied back over
      fs.removeSync(path.join(process.cwd(), 'test_server/src/services/HttpHeadersCacheService.ts'));
      const ymlPath = path.join(process.cwd(), 'test_swagger.yml');
      await openapiNodegen({
        dontRunComparisonTool: false,
        dontUpdateTplCache: true,
        updateDependenciesFromTpl: false,
        mockServer: true,
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

  it('Should have the correct file hashes', async (done) => {
    // If these tests fail the either:
    // A) The test_swagger.yml has changed
    // B) The tpl for the typescipt server has change
    // C) Something broke when building the said files

    const expectedPathHashes = [
      // Check rabbitMQ domains (STUB file)
      ['test_server/src/domains/domainsImporter.ts', '8502ae153a067f2832b991a4b6b4812a'],
      ['test_server/src/domains/WeatherDomain.ts', 'e41b209a29db6a4fd75d420e128c4f23'],
      ['test_server/src/domains/WeatherIdDomain.ts', 'a4cabc695f4ba6bc869abe980faaa2f0'],
      // Check complex interface (INTERFACE file)
      ['test_server/src/http/nodegen/interfaces/WeatherFull.ts', 'ae5f4c579130f22b8d5aeb931a6fac74'],
      // Check the interface index file (OTHER file)
      ['test_server/src/http/nodegen/interfaces/index.ts', '2dea80dc1b9399bf4de6a61be62535e6'],
      // Check the security definition files (OTHER file)
      ['test_server/src/http/nodegen/security/definitions.ts', 'acb2aa134d1e8ac90765a24b367166ea'],
      // Check the routes files (OPERATION file)
      ['test_server/src/http/nodegen/routesImporter.ts', '32fc29c3c892e0e0fce35cbd8780d0f6'],
      ['test_server/src/http/nodegen/routes/rainRoutes.ts', 'c718e747981b83536cc607032ad890f8'],
      ['test_server/src/http/nodegen/routes/weatherRoutes.ts', '22f5e21d63ef3dfc88deb17e157e80a5'],
      // Check the output transformers (OPERATION file)
      ['test_server/src/http/nodegen/transformOutputs/weatherTransformOutput.ts', '7bf587be316ef1b65f806bff871417b6'],
      ['test_server/src/http/nodegen/interfaces/JwtAccess.ts', 'e5e4baabba301bed91746dc770035fe5'],
      ['test_server/src/http/nodegen/interfaces/WeatherGetQuery.ts', 'f314eaadd0e58e47588860f6d3e2029b'],
      // Check dynamic docker file (OTHER file)
      ['test_server/docker-compose.yml', '779fd3809240f10dd84c8c070f0851d3'],
      // Check git ignore was copied over (OTHER file)
      // Check the deleted service file was reinjected
      ['test_server/src/services/HttpHeadersCacheService.ts', '2498e94e30b5e52f912ea8877573f889'],
      ['test_server/README.md', '58f081882201c8862ec53d581b149093'],
    ];

    const mismatched: string[] = [];
    for (let i = 0; i < expectedPathHashes.length; ++i) {
      const filePath = expectedPathHashes[i][0];
      const fileHash = expectedPathHashes[i][1];
      const hash = await hasha.fromFile(path.join(process.cwd(), filePath), { algorithm: 'md5' });
      if (hash !== fileHash) {
        const wrong = `Hash mis-match for file ${filePath}. Expected hash ${fileHash} but got ${hash}`;
        mismatched.push(wrong);
      }
    }
    if (mismatched.length > 0) {
      done(mismatched);
    } else {
      done();
    }
  });
});
