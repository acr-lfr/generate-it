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
      const ymlPath = path.join(process.cwd(), 'test_swagger.yml');
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
      const ymlPath = path.join(process.cwd(), 'test_swagger.yml');
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
      ['test_server/src/domains/RainDomain.ts', 'e2532eaea403ddd12b078813f5d791a9'],
      ['test_server/src/domains/WeatherDomain.ts', 'c535af2b16ae22dc4e5d8e64f789f9b2'],
      // Check complex interface (INTERFACE file)
      ['test_server/src/http/nodegen/interfaces/WeatherFull.ts', '3b5de54103373a6f2e1d6945c0c1c66e'],
      // Check the interface index file (OTHER file)
      ['test_server/src/http/nodegen/interfaces/index.ts', '5b9eaa0f0be87b03467473b6c094424b'],
      // Check the security definition files (OTHER file)
      ['test_server/src/http/nodegen/security/definitions.ts', 'c14f49726b33f9ee55074fa0bc496bf5'],
      // Check the generated routes files (OPERATION file)
      ['test_server/src/http/nodegen/routes/rainRoutes.ts', '7a0d269931ec99a5e3f1d85ee71f01d0'],
      ['test_server/src/http/nodegen/routes/weatherRoutes.ts', 'df058e2bd376253104f0c7c9501a72c9'],
      // Check the output transformers (OPERATION file)
      ['test_server/src/http/nodegen/transformOutputs/weatherTransformOutput.ts', '14d4332f20b73acc928509109f55d781'],
      // Check dynamic docker file (OTHER file)
      ['test_server/docker-compose.yml', 'd553b06bbfc2fb3e9f4fa92dd293b4c1'],
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
      done(mismatched);
    } else {
      done();
    }
  });
});
