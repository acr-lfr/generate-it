import fs from 'fs-extra';
import path from 'path';
import openapiNodegen from '@/openapiNodegen';
import hasha from 'hasha';

jest.setTimeout(60 * 1000); // in milliseconds

const testServerPath = path.join(process.cwd(), 'test_server');
export const tplUrl = 'https://github.com/acrontum/openapi-nodegen-typescript-server.git';
export const clearTestServer = () => {
  // return;
  const names = fs.readdirSync(path.join(process.cwd(), 'test_server'));
  for (let i = 0; i < names.length; ++i) {
    if (names[i] !== '.openapi-nodegen') {
      fs.removeSync(path.join(process.cwd(), 'test_server', names[i]));
    }
  }
  const compare = path.join(process.cwd(), 'test_server/.openapi-nodegen/cache');
  if (fs.pathExistsSync(compare)) {
    fs.removeSync(compare);
  }
};
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

  it('Should build again without error on top of the existing generation', async (done) => {
    try {
      // remove a survive file which should then be copied back over
      fs.removeSync(path.join(process.cwd(), 'test_server/src/services/HttpHeadersCacheService.ts'));
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
      ['test_server/src/domains/WeatherDomain.ts', 'dbfef2c0a7d8bdcd7c0549c530675f21'],
      // Check complex interface (INTERFACE file)
      ['test_server/src/http/nodegen/interfaces/WeatherPost.ts', 'fbe8cf7a8f93f34bb646d564223f854f'],
      // Check the interface index file (OTHER file)
      ['test_server/src/http/nodegen/interfaces/index.ts', 'a46c50a6c7f1a58da526a18aec2d875e'],
      // Check the security definition files (OTHER file)
      ['test_server/src/http/nodegen/security/definitions.ts', '9fe31e21af71374e62bcb49bb2d40567'],
      // Check the generated routes files (OPERATION file)
      ['test_server/src/http/nodegen/routes/weatherRoutes.ts', 'ae018ac9cc87624c7bc8c3400d7d6d57'],
      // Check the output transformers (OPERATION file)
      ['test_server/src/http/nodegen/transformOutputs/weatherTransformOutput.ts', '273e4308cdd6ebad57cdac5f1893e8f3'],
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
