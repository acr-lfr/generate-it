import path from 'path';
import openapiNodegen from '@/generateIt';
import hasha from 'hasha';
import fs from 'fs-extra';
const {hashElement} = require('folder-hash');

jest.setTimeout(60 * 1000); // in milliseconds

export const clearTestServer = (dir: string = 'test_server') => {
  // return;
  const names = fs.readdirSync(path.join(process.cwd(), dir));
  for (let i = 0; i < names.length; ++i) {
    if (names[i] !== '.openapi-nodegen') {
      fs.removeSync(path.join(process.cwd(), dir, names[i]));
    }
  }
  const compare = path.join(process.cwd(), dir, '/.openapi-nodegen/cache');
  if (fs.pathExistsSync(compare)) {
    fs.removeSync(compare);
  }
};

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
      ['test_asyncapi/generated/channels/MsAuthChannel.ts', 'ea28254cdb902664f9ed0de58de67c6b'],
      ['test_asyncapi/generated/channels/channelExporter.ts', 'e092b2a17ba2d3d90970978a7cac2e59'],
      ['test_asyncapi/generated/operationIds.ts', '0183d24df0cdbeb122f0e78552a66c6c'],
      ['test_asyncapi/generated/RabbitMQService.ts', 'd9fd6e44d904f61e08c8d1b5db6efadf'],
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
    expect(hash.hash).toBe('F2I3FeomBqkTdJn7hRIiSbEoELI=');
  });
});
