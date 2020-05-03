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
      ['test_asyncapi/generated/channels/MsAuthChannel.ts', 'b61559c72d3a8e20103977b467c70650'],
      ['test_asyncapi/generated/channels/channelExporter.ts', '58f977b01f5263b361b4bf7faeb1e33c'],
      ['test_asyncapi/generated/operationIds.ts', '2740d3cfa39128578eab114927ea65c9'],
      ['test_asyncapi/generated/RabbitMQService.ts', '97aa04cf142c0d8fe4be1ace639ce518'],
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
    expect(hash.hash).toBe('8O/PYgVzBv/0i3Ok7xVZEb3W3eY=');
  });
});
