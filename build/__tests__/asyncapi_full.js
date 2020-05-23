"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var generateIt_1 = tslib_1.__importDefault(require("../generateIt"));
var hasha_1 = tslib_1.__importDefault(require("hasha"));
var hashElement = require('folder-hash').hashElement;
var helpers_1 = require("./helpers");
jest.setTimeout(60 * 1000); // in milliseconds
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
    it('Should build without error', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var ymlPath, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    ymlPath = path_1["default"].join(process.cwd(), 'test_asyncapi.yml');
                    return [4 /*yield*/, generateIt_1["default"]({
                            dontRunComparisonTool: false,
                            dontUpdateTplCache: false,
                            mockServer: false,
                            segmentsCount: 1,
                            swaggerFilePath: ymlPath,
                            targetDir: testServerPath,
                            template: exports.tplUrl
                        })];
                case 1:
                    _a.sent();
                    done();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    done(e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('Should have the correct file hashes', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var filePaths, mismatched, i, filePath, fileHash, hash, wrong;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePaths = [
                        // Check generated domains (STUB file)
                        ['test_asyncapi/generated/channels/MsAuthChannel.ts', 'ea28254cdb902664f9ed0de58de67c6b'],
                        ['test_asyncapi/generated/channels/channelExporter.ts', '077cfeb574c6f1b6e596bcf732038d3b'],
                        ['test_asyncapi/generated/operationIds.ts', '0183d24df0cdbeb122f0e78552a66c6c'],
                        ['test_asyncapi/generated/RabbitMQService.ts', '9362acbbaa0609547980d95fa77ecf71'],
                    ];
                    mismatched = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < filePaths.length)) return [3 /*break*/, 4];
                    filePath = filePaths[i][0];
                    fileHash = filePaths[i][1];
                    return [4 /*yield*/, hasha_1["default"].fromFile(path_1["default"].join(process.cwd(), filePath), { algorithm: 'md5' })];
                case 2:
                    hash = _a.sent();
                    if (hash !== fileHash) {
                        wrong = "Hash mis-match for file " + filePath + ". Expected hash " + fileHash + " but got " + hash;
                        mismatched.push(wrong);
                    }
                    _a.label = 3;
                case 3:
                    ++i;
                    return [3 /*break*/, 1];
                case 4:
                    if (mismatched.length > 0) {
                        done(mismatched);
                    }
                    else {
                        done();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return the correct hash for the domain folder', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var options, domainPath, hash;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        files: { include: ['*.ts'] }
                    };
                    domainPath = path_1["default"].join(testServerPath, 'domains');
                    return [4 /*yield*/, hashElement(domainPath, options)];
                case 1:
                    hash = _a.sent();
                    expect(hash.hash).toBe('CYmW34U8XQoJnAM/mhU8xTHY7Ak=');
                    return [2 /*return*/];
            }
        });
    }); });
});
