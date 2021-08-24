import fs from 'fs-extra';
import path from 'path';
import openapiNodegen from '@/generateIt';
import hasha from 'hasha';
import { clearTestServer, tplUrl } from './helpers';

jest.setTimeout(60 * 1000); // in milliseconds
const testServerPath = path.join(process.cwd(), 'test_server');
const swaggerFilePath = path.join(process.cwd(), 'test_swagger.yml');

describe('e2e testing', () => {
  beforeAll(() => {
    clearTestServer();
  });
  afterAll(() => {
    clearTestServer();
  });

  it('Should build without error', (done) => {
    openapiNodegen({
      dontRunComparisonTool: false,
      dontUpdateTplCache: true,
      updateDependenciesFromTpl: false,
      mockServer: true,
      swaggerFilePath,
      targetDir: testServerPath,
      template: tplUrl,
      variables: {
        name: 'Generate-it Typescript Server'
      }
    })
      .then(() => done())
      .catch(e => done(e));
  });

  it('Should build again without error on top of the existing generation', (done) => {
    // remove a survive file which should then be copied back over
    fs.removeSync(path.join(process.cwd(), 'test_server/src/services/HttpHeadersCacheService.ts'));
    openapiNodegen({
      dontRunComparisonTool: false,
      dontUpdateTplCache: true,
      updateDependenciesFromTpl: false,
      mockServer: true,
      swaggerFilePath,
      targetDir: testServerPath,
      template: tplUrl,
    })
      .then(() => done())
      .catch(e => done(e));
  });

  it(`shouldn't mangle package.json`, async () => {
    const jsonfile = path.join(testServerPath, 'package.json');
    fs.writeFileSync(jsonfile, '{\n  "name": "hallo",\n  "scripts": {\n    "go-away": "rm -rf *"\n  }\n}');
    let json = require(jsonfile);
    expect(!!json.scripts['go-away']).toBe(true);

    await openapiNodegen({
      dontRunComparisonTool: false,
      dontUpdateTplCache: true,
      updateDependenciesFromTpl: false,
      mockServer: true,
      swaggerFilePath,
      targetDir: testServerPath,
      template: tplUrl,
    });

    json = require(jsonfile);
    expect(!!json.scripts['go-away']).toBe(true);
  });

  it('Should have the correct file hashes', async () => {
    // If these tests fail the either:
    // A) The test_swagger.yml has changed
    // B) The tpl for the typescipt server has change
    // C) Something broke when building the said files

    const expectedPathHashes = [
      // Check rabbitMQ domains (STUB file)
      ['test_server/src/domains/domainsImporter.ts', '8502ae153a067f2832b991a4b6b4812a'],
      ['test_server/src/domains/WeatherDomain.ts', '30efe49b22921328e0be1ddc5c3e17a4'],
      ['test_server/src/domains/RainDomain.ts', '2661960ee5787a58e824419d96c95cb4'],
      // Check complex interface (INTERFACE file)
      ['test_server/src/http/nodegen/interfaces/WeatherFull.ts', 'ae5f4c579130f22b8d5aeb931a6fac74'],
      // Check the interface index file (OTHER file)
      ['test_server/src/http/nodegen/interfaces/index.ts', '2dea80dc1b9399bf4de6a61be62535e6'],
      // Check the security definition files (OTHER file)
      ['test_server/src/http/nodegen/security/definitions.ts', 'acb2aa134d1e8ac90765a24b367166ea'],
      // Check the rabbitMQ routes files (OPERATION file)
      ['test_server/src/http/nodegen/routes/rainRoutes.ts', 'c718e747981b83536cc607032ad890f8'],
      ['test_server/src/http/nodegen/routes/weatherRoutes.ts', 'e2f5987fd26f02a201e9bdcba6edf06c'],
      // Check the output transformers (OPERATION file)
      ['test_server/src/http/nodegen/transformOutputs/weatherTransformOutput.ts', '7a307263c483540e2c1577354abfbe46'],
      ['test_server/src/http/nodegen/interfaces/JwtAccess.ts', 'e5e4baabba301bed91746dc770035fe5'],
      ['test_server/src/http/nodegen/interfaces/WeatherGetQuery.ts', 'f314eaadd0e58e47588860f6d3e2029b'],
      ['test_server/src/http/nodegen/validators/weatherValidators.ts', 'd7c35ac627bdedfac1b5bd4588b3b331'],
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
      const hash = await hasha.fromFile(path.join(process.cwd(), filePath), {algorithm: 'md5'});
      if (hash !== fileHash) {
        const wrong = `Hash mis-match for file ${filePath}. Expected hash ${fileHash} but got ${hash}`;
        mismatched.push(wrong);
      }
    }
    if (mismatched.length > 0) {
      console.error(mismatched);
    }
    expect(mismatched.length).toBe(0);
  });

  it('should remove the ___eval file', (done) => {
    if (fs.existsSync(path.join(process.cwd(), 'test_server/src/http/nodegen/tests/___eval.ts'))) {
      done('test_server/src/http/nodegen/tests/___eval.ts should not be there!');
    }
    if (fs.existsSync(path.join(process.cwd(), 'test_server/src/http/nodegen/tests/___eval.js'))) {
      done('test_server/src/http/nodegen/tests/___eval.js should not be there!');
    }
    done();
  });
});
