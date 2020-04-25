import path from 'path';
import openapiNodegen from '@/generateIt';
import { clearTestServer } from '@/__tests__/openapiNodegen_full';
import hasha from 'hasha';

const {hashElement} = require('folder-hash');

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
      ['test_asyncapi/generated/channels.ts', 'f3fcb4b9fab361377a05fae8f1173759'],
      ['test_asyncapi/generated/domainIndex.ts', '700b6ad7d74985387c253293dfa0da07'],

      ['test_asyncapi/generated/operationIds.ts', '5c8c2e3b6d60b9562c97b713cf614a26'],
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
  it('should return the correct hash for the domain folder', async () => {
    const options = {
      files: {include: ['*.ts']}
    };
    const domainPath = path.join(testServerPath, 'domains');
    const hash = await hashElement(domainPath, options);
    expect(hash.hash).toBe('0GfdCxTaw49b2/iPsi5L7hrNV+c=');
  });
});
