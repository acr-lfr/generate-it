import openapiNodegen from '@/generateIt';
import { fdir } from 'fdir';
import path from 'path';
import { clearTestServer, yamlToJson } from './helpers';
import hasha from 'hasha';

const serverDir = 'test_asyncapi';
const testServerPath = path.join(process.cwd(), serverDir);
export const tplUrl = 'https://github.com/acrontum/generate-it-asyncapi-rabbitmq.git';

beforeAll(() => {
  clearTestServer(serverDir);
});

afterAll(() => {
  clearTestServer(serverDir);
});

it('Should build without error', async () => {
  const ymlPath = path.join(process.cwd(), 'test_asyncapi.yml');

  const wasGenerated = await openapiNodegen({
    dontRunComparisonTool: false,
    dontUpdateTplCache: true,
    updateDependenciesFromTpl: false,
    mockServer: false,
    swaggerFilePath: ymlPath,
    targetDir: testServerPath,
    template: tplUrl,
  });

  expect(wasGenerated).toBe(true);
});

it('output folder should have all the files', async () => {
  const api = new fdir().crawlWithOptions(testServerPath, {
    includeBasePath: true,
    exclude: (dir) => dir === '.openapi-nodegen' || dir === '.idea',
  });
  const files = (api.sync() as string[]).map((file) => file.replace(`${testServerPath}/`, ''));

  expect(files.includes('.gitignore')).toBe(true);
  expect(files.includes('.nodegenrc')).toBe(true);
  expect(files.includes('LICENSE')).toBe(true);
  expect(files.includes('README.md')).toBe(true);
  expect(files.includes('openapi-nodegen-api-file.yml')).toBe(true);
  expect(files.includes('package.json')).toBe(true);
  expect(files.includes('rabbitMQ/Service.ts')).toBe(true);
  expect(files.includes('rabbitMQ/interfaces/MsAuthCacheConnection.ts')).toBe(true);
  expect(files.includes('rabbitMQ/interfaces/MsAuthCacheUser.ts')).toBe(true);
  expect(files.includes('rabbitMQ/interfaces/index.ts')).toBe(true);
  expect(files.includes('rabbitMQ/operationIds.ts')).toBe(true);
  expect(files.includes('subscribeHandles/MsAuthCacheConnectionSubscribeHandle.ts')).toBe(true);
});

it('should pass the hash checks for key files', async () => {
  const expectedPathHashes = [
    ['test_asyncapi/rabbitMQ/operationIds.ts', '1696b25d08581f736d12fbe4ff411181'],
    ['test_asyncapi/rabbitMQ/Service.ts', '0fffde6c4b3b2ac7b1ace14b90994bd7']
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

it('should have the correct YAML structure', async () => {
  const schema = await yamlToJson(path.resolve(testServerPath, 'openapi-nodegen-api-file.yml'));

  expect(schema.asyncapi).toBe('2.0.0');
  expect(schema.info.title).toBe('boats');
  expect(schema.info.version).toBe('1.0.1');
  expect(schema.info.description).toBe('Beautiful Open / Async Template System - Write less yaml with BOATS and Nunjucks.');
  expect(schema.info.license.name).toBe('Apache 2.0');
  expect(schema.info.license.url).toBe('https://www.apache.org/licenses/LICENSE-2.0');
  expect(schema.defaultContentType).toBe('application/json');
  expect(schema.channels['/ms-auth/cache-connection'].description).toBe('When a new connection change occurs the new cache values are emitted in the payload');
  expect(schema.channels['/ms-auth/cache-connection'].publish.operationId).toBe('msAuthCacheConnection');
  expect(schema.channels['/ms-auth/cache-connection'].publish.message.contentType).toBe('application/json');
  expect(schema.channels['/ms-auth/cache-connection'].publish.message.payload.$ref).toBe('#/components/schemas/MsAuthCacheConnection');
  expect(schema.channels['/ms-auth/cache-connection'].subscribe.operationId).toBe('msAuthCacheConnection');
  expect(schema.channels['/ms-auth/cache-connection'].subscribe.message.contentType).toBe('application/json');
  expect(schema.channels['/ms-auth/cache-connection'].subscribe.message.payload.$ref).toBe('#/components/schemas/MsAuthCacheConnection');
  expect(schema.channels['/ms-image/cache-user'].description).toBe('When a new connection change occurs the new cache values are emitted in the payload');
  expect(schema.channels['/ms-image/cache-user'].publish.operationId).toBe('msImageCacheUser');
  expect(schema.channels['/ms-image/cache-user'].publish.message.contentType).toBe('application/json');
  expect(schema.channels['/ms-image/cache-user'].publish.message.payload.$ref).toBe('#/components/schemas/MsAuthCacheUser');
  expect(schema.channels['/ms-image/cache-user'].subscribe.operationId).toBe('msImageCacheUser');
  expect(schema.channels['/ms-image/cache-user'].subscribe.message.contentType).toBe('application/json');
  expect(schema.channels['/ms-image/cache-user'].subscribe.message.payload.$ref).toBe('#/components/schemas/MsAuthCacheUser');
  expect(schema.channels['/ms-item/delete-user'].description).toBe('When a new connection change occurs the new cache values are emitted in the payload');
  expect(schema.channels['/ms-item/delete-user'].publish.operationId).toBe('msItemDeleteUser');
  expect(schema.channels['/ms-item/delete-user'].publish.message.contentType).toBe('application/json');
  expect(schema.channels['/ms-item/delete-user'].publish.message.payload.$ref).toBe('#/components/schemas/MsAuthCacheUser');
  expect(schema.channels['/ms-item/delete-user'].subscribe.operationId).toBe('msItemDeleteUser');
  expect(schema.channels['/ms-item/delete-user'].subscribe.message.contentType).toBe('application/json');
  expect(schema.channels['/ms-item/delete-user'].subscribe.message.payload.$ref).toBe('#/components/schemas/MsAuthCacheUser');
  expect(schema.components.schemas.MsAuthCacheConnection.type).toBe('object');
  expect(schema.components.schemas.MsAuthCacheConnection.properties.username.type).toBe('string');
  expect(schema.components.schemas.MsAuthCacheConnection.properties.connections.type).toBe('array');
  expect(schema.components.schemas.MsAuthCacheConnection.properties.connections.items.type).toBe('object');
  expect(schema.components.schemas.MsAuthCacheConnection.properties.connections.items.properties.updated.type).toBe('string');
  expect(schema.components.schemas.MsAuthCacheConnection.properties.connections.items.properties.updated.format).toBe('date');
  expect(schema.components.schemas.MsAuthCacheConnection.properties.connections.items.properties.state.type).toBe('string');
  expect(schema.components.schemas.MsAuthCacheConnection.properties.connections.items.properties.username.type).toBe('string');
  expect(schema.components.schemas.MsAuthCacheUser.type).toBe('object');
  expect(schema.components.schemas.MsAuthCacheUser.properties.username.type).toBe('string');
  expect(schema.components.schemas.MsAuthCacheUser.properties.email.type).toBe('string');
});
