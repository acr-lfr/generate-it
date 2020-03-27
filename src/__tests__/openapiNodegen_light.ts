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
      const ymlPath = path.join(process.cwd(), 'test_swagger2.yml');
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
      const ymlPath = path.join(process.cwd(), 'test_swagger2.yml');
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
      ['test_server/src/domains/AdminDomain.ts', 'c35bbf396d58fb025bbb6a87bd0db710'],
      ['test_server/src/domains/AuthDomain.ts', 'afcd4847afbe8c46650407aaaa3c28ab'],
      // Check the interface index file (OTHER file)
      ['test_server/src/http/nodegen/interfaces/index.ts', '108b13afd431e1d848c7c214abaa3418'],
      // Check the generated routes files (OPERATION file)
      ['test_server/src/http/nodegen/routes/adminRoutes.ts', '1ec1ba6d7a8a7a565a1857fa4923e5b4'],
      ['test_server/src/http/nodegen/routes/authRoutes.ts', '34de0cd68a5b15f9304f32a1053f3c4e'],
      // Check the output transformers (OPERATION file)
      ['test_server/src/http/nodegen/transformOutputs/authTransformOutput.ts', '427a7c83471309303feb8c5ba169e3a9'],
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
