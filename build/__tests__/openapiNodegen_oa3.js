"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var generateIt_1 = tslib_1.__importDefault(require("../generateIt"));
var hasha_1 = tslib_1.__importDefault(require("hasha"));
var helpers_1 = require("./helpers");
jest.setTimeout(60 * 1000); // in milliseconds
var testServerPath = path_1["default"].join(process.cwd(), 'test_server');
describe('e2e testing', function () {
    beforeAll(function () {
        helpers_1.clearTestServer();
    });
    afterAll(function () {
        helpers_1.clearTestServer();
    });
    it('Should build without error', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var ymlPath, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    ymlPath = path_1["default"].join(process.cwd(), 'test_openapi3.yml');
                    return [4 /*yield*/, generateIt_1["default"]({
                            dontRunComparisonTool: false,
                            dontUpdateTplCache: true,
                            mockServer: true,
                            segmentsCount: 1,
                            swaggerFilePath: ymlPath,
                            targetDir: testServerPath,
                            template: helpers_1.tplUrl
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
        var expectedPathHashes, mismatched, i, filePath, fileHash, hash, wrong;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectedPathHashes = [
                        // Check rabbitMQ domains (STUB file)
                        [
                            'test_server/src/domains/domainsImporter.ts',
                            '40c2afe0eb99354e208ba9833e9fbfd4',
                        ],
                        [
                            'test_server/src/domains/WeatherDomain.ts',
                            '6f7097720b51eeb4b2bbd073aeb49111',
                        ],
                        // Check complex interface (INTERFACE file)
                        [
                            'test_server/src/http/nodegen/interfaces/WeatherFull.ts',
                            '3b5de54103373a6f2e1d6945c0c1c66e',
                        ],
                        // Check the interface index file (OTHER file)
                        [
                            'test_server/src/http/nodegen/interfaces/index.ts',
                            'db175959c900708e577b790970f7fee0',
                        ],
                        // Check the security definition files (OTHER file)
                        [
                            'test_server/src/http/nodegen/security/definitions.ts',
                            '6b25d2dcc74702d6fa231ea3719eefa2',
                        ],
                        // Check the rabbitMQ routes files (OPERATION file)
                        [
                            'test_server/src/http/nodegen/routes/rainRoutes.ts',
                            '18d92a00b90852ff39e7cac9fff9aa8d',
                        ],
                        [
                            'test_server/src/http/nodegen/routes/weatherRoutes.ts',
                            'e2f5987fd26f02a201e9bdcba6edf06c',
                        ],
                        // Check the output transformers (OPERATION file)
                        [
                            'test_server/src/http/nodegen/transformOutputs/weatherTransformOutput.ts',
                            '4aa51bd321328186343834ac287f1cca',
                        ],
                        // Check dynamic docker file (OTHER file)
                        ['test_server/docker-compose.yml', '779fd3809240f10dd84c8c070f0851d3'],
                        // Check git ignore was copied over (OTHER file)
                        // Check the deleted service file was reinjected
                        [
                            'test_server/src/services/HttpHeadersCacheService.ts',
                            '2498e94e30b5e52f912ea8877573f889',
                        ],
                    ];
                    mismatched = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < expectedPathHashes.length)) return [3 /*break*/, 4];
                    filePath = expectedPathHashes[i][0];
                    fileHash = expectedPathHashes[i][1];
                    return [4 /*yield*/, hasha_1["default"].fromFile(path_1["default"].join(process.cwd(), filePath), {
                            algorithm: 'md5'
                        })];
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
                        console.log(mismatched);
                        done(mismatched);
                    }
                    else {
                        done();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
