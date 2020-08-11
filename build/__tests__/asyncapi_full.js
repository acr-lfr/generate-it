"use strict";
exports.__esModule = true;
exports.tplUrl = void 0;
var tslib_1 = require("tslib");
var generateIt_1 = tslib_1.__importDefault(require("../generateIt"));
var fdir_1 = require("fdir");
var path_1 = tslib_1.__importDefault(require("path"));
var helpers_1 = require("./helpers");
var serverDir = 'test_asyncapi';
var testServerPath = path_1["default"].join(process.cwd(), serverDir);
exports.tplUrl = 'https://github.com/acrontum/generate-it-asyncapi-rabbitmq.git';
describe('e2e testing', function () {
    beforeAll(function () {
        helpers_1.clearTestServer(serverDir);
    });
    afterAll(function () {
        helpers_1.clearTestServer(serverDir);
    });
    it('Should build without error', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var ymlPath, wasGenerated;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ymlPath = path_1["default"].join(process.cwd(), 'test_asyncapi.yml');
                    return [4 /*yield*/, generateIt_1["default"]({
                            dontRunComparisonTool: false,
                            dontUpdateTplCache: true,
                            mockServer: false,
                            swaggerFilePath: ymlPath,
                            targetDir: testServerPath,
                            template: exports.tplUrl
                        })];
                case 1:
                    wasGenerated = _a.sent();
                    expect(wasGenerated).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('output folder should have all the files', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var api, files;
        return tslib_1.__generator(this, function (_a) {
            api = new fdir_1.fdir().crawlWithOptions(testServerPath, {
                includeBasePath: true,
                exclude: function (dir) { return dir === '.openapi-nodegen' || dir === '.idea'; }
            });
            files = api.sync().map(function (file) { return file.replace(testServerPath + "/", ''); });
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
            return [2 /*return*/];
        });
    }); });
    it('should have the correct YAML structure', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var schema;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, helpers_1.yamlToJson(path_1["default"].resolve(testServerPath, 'openapi-nodegen-api-file.yml'))];
                case 1:
                    schema = _a.sent();
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
                    return [2 /*return*/];
            }
        });
    }); });
});
