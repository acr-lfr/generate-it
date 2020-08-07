"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
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
                    ymlPath = path_1["default"].join(process.cwd(), 'test_swagger.yml');
                    return [4 /*yield*/, generateIt_1["default"]({
                            dontRunComparisonTool: false,
                            dontUpdateTplCache: true,
                            mockServer: true,
                            swaggerFilePath: ymlPath,
                            targetDir: testServerPath,
                            template: helpers_1.tplUrl,
                            variables: {
                                name: 'Generate-it Typescript Server'
                            }
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
    it('Should build again without error on top of the existing generation', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var ymlPath, e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // remove a survive file which should then be copied back over
                    fs_extra_1["default"].removeSync(path_1["default"].join(process.cwd(), 'test_server/src/services/HttpHeadersCacheService.ts'));
                    ymlPath = path_1["default"].join(process.cwd(), 'test_swagger.yml');
                    return [4 /*yield*/, generateIt_1["default"]({
                            dontRunComparisonTool: false,
                            dontUpdateTplCache: true,
                            mockServer: true,
                            swaggerFilePath: ymlPath,
                            targetDir: testServerPath,
                            template: helpers_1.tplUrl
                        })];
                case 1:
                    _a.sent();
                    done();
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    done(e_2);
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
                        ['test_server/src/domains/domainsImporter.ts', '8502ae153a067f2832b991a4b6b4812a'],
                        ['test_server/src/domains/WeatherDomain.ts', '30efe49b22921328e0be1ddc5c3e17a4'],
                        // Check complex interface (INTERFACE file)
                        ['test_server/src/http/nodegen/interfaces/WeatherFull.ts', 'ae5f4c579130f22b8d5aeb931a6fac74'],
                        // Check the interface index file (OTHER file)
                        ['test_server/src/http/nodegen/interfaces/index.ts', '2dea80dc1b9399bf4de6a61be62535e6'],
                        // Check the security definition files (OTHER file)
                        ['test_server/src/http/nodegen/security/definitions.ts', 'acb2aa134d1e8ac90765a24b367166ea'],
                        // Check the rabbitMQ routes files (OPERATION file)
                        ['test_server/src/http/nodegen/routes/rainRoutes.ts', '0d81b9b22205107531b8c26adddcdb22'],
                        ['test_server/src/http/nodegen/routes/weatherRoutes.ts', 'e2f5987fd26f02a201e9bdcba6edf06c'],
                        // Check the output transformers (OPERATION file)
                        ['test_server/src/http/nodegen/transformOutputs/weatherTransformOutput.ts', '7a307263c483540e2c1577354abfbe46'],
                        ['test_server/src/http/nodegen/interfaces/JwtAccess.ts', 'e5e4baabba301bed91746dc770035fe5'],
                        ['test_server/src/http/nodegen/interfaces/WeatherGetQuery.ts', 'f314eaadd0e58e47588860f6d3e2029b'],
                        // Check dynamic docker file (OTHER file)
                        ['test_server/docker-compose.yml', '779fd3809240f10dd84c8c070f0851d3'],
                        // Check git ignore was copied over (OTHER file)
                        // Check the deleted service file was reinjected
                        ['test_server/src/services/HttpHeadersCacheService.ts', '2498e94e30b5e52f912ea8877573f889'],
                        ['test_server/README.md', '58f081882201c8862ec53d581b149093'],
                    ];
                    mismatched = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < expectedPathHashes.length)) return [3 /*break*/, 4];
                    filePath = expectedPathHashes[i][0];
                    fileHash = expectedPathHashes[i][1];
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
});
