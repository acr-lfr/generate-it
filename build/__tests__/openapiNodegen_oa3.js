"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var openapiNodegen_1 = tslib_1.__importDefault(require("../openapiNodegen"));
var hasha_1 = tslib_1.__importDefault(require("hasha"));
jest.setTimeout(60 * 1000); // in milliseconds
var testServerPath = path_1["default"].join(process.cwd(), 'test_server');
exports.tplUrl = 'https://github.com/acrontum/openapi-nodegen-typescript-server.git';
exports.clearTestServer = function () {
    // return;
    var names = fs_extra_1["default"].readdirSync(path_1["default"].join(process.cwd(), 'test_server'));
    for (var i = 0; i < names.length; ++i) {
        if (names[i] !== '.openapi-nodegen') {
            fs_extra_1["default"].removeSync(path_1["default"].join(process.cwd(), 'test_server', names[i]));
        }
    }
    var compare = path_1["default"].join(process.cwd(), 'test_server/.openapi-nodegen/cache');
    if (fs_extra_1["default"].pathExistsSync(compare)) {
        fs_extra_1["default"].removeSync(compare);
    }
};
describe('e2e testing', function () {
    beforeAll(function () {
        exports.clearTestServer();
    });
    afterAll(function () {
        exports.clearTestServer();
    });
    it('Should build without error', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var ymlPath, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    ymlPath = path_1["default"].join(process.cwd(), 'test_openapi3.yml');
                    return [4 /*yield*/, openapiNodegen_1["default"]({
                            dontRunComparisonTool: false,
                            dontUpdateTplCache: true,
                            mockServer: true,
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
    it('Should build again without error on top of the existing generation', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var ymlPath, e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // remove a survive file which should then be copied back over
                    fs_extra_1["default"].removeSync(path_1["default"].join(process.cwd(), 'test_server/src/services/HttpHeadersCacheService.ts'));
                    ymlPath = path_1["default"].join(process.cwd(), 'test_openapi3.yml');
                    return [4 /*yield*/, openapiNodegen_1["default"]({
                            dontRunComparisonTool: false,
                            dontUpdateTplCache: true,
                            mockServer: true,
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
                    e_2 = _a.sent();
                    done(e_2);
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
                        ['test_server/src/domains/WeatherDomain.ts', 'dbfef2c0a7d8bdcd7c0549c530675f21'],
                        // Check complex interface (INTERFACE file)
                        ['test_server/src/http/nodegen/interfaces/WeatherPost.ts', 'fbe8cf7a8f93f34bb646d564223f854f'],
                        // Check the interface index file (OTHER file)
                        ['test_server/src/http/nodegen/interfaces/index.ts', 'a46c50a6c7f1a58da526a18aec2d875e'],
                        // Check the security definition files (OTHER file)
                        ['test_server/src/http/nodegen/security/definitions.ts', '9fe31e21af71374e62bcb49bb2d40567'],
                        // Check the generated routes files (OPERATION file)
                        ['test_server/src/http/nodegen/routes/weatherRoutes.ts', 'ae018ac9cc87624c7bc8c3400d7d6d57'],
                        // Check the output transformers (OPERATION file)
                        ['test_server/src/http/nodegen/transformOutputs/weatherTransformOutput.ts', '273e4308cdd6ebad57cdac5f1893e8f3'],
                        // Check dynamic docker file (OTHER file)
                        ['test_server/docker-compose.yml', '77046129af45b9b24ced9969ba669acd'],
                        // Check git ignore was copied over (OTHER file)
                        ['test_server/.gitignore', '7603a99efa78b3faf4ff493cf1cb0fb7'],
                        // Check the deleted service file was reinjected
                        ['test_server/src/services/HttpHeadersCacheService.ts', '144cd39920fd8e042a57f83628479979'],
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
