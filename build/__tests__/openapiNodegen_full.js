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
                    ymlPath = path_1["default"].join(process.cwd(), 'test_swagger.yml');
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
                    ymlPath = path_1["default"].join(process.cwd(), 'test_swagger.yml');
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
                        ['test_server/src/domains/RainDomain.ts', 'e2532eaea403ddd12b078813f5d791a9'],
                        ['test_server/src/domains/WeatherDomain.ts', 'c535af2b16ae22dc4e5d8e64f789f9b2'],
                        // Check complex interface (INTERFACE file)
                        ['test_server/src/http/nodegen/interfaces/WeatherFull.ts', '3b5de54103373a6f2e1d6945c0c1c66e'],
                        // Check the interface index file (OTHER file)
                        ['test_server/src/http/nodegen/interfaces/index.ts', '5b9eaa0f0be87b03467473b6c094424b'],
                        // Check the security definition files (OTHER file)
                        ['test_server/src/http/nodegen/security/definitions.ts', 'c14f49726b33f9ee55074fa0bc496bf5'],
                        // Check the generated routes files (OPERATION file)
                        ['test_server/src/http/nodegen/routes/rainRoutes.ts', '7a0d269931ec99a5e3f1d85ee71f01d0'],
                        ['test_server/src/http/nodegen/routes/weatherRoutes.ts', 'df058e2bd376253104f0c7c9501a72c9'],
                        // Check the output transformers (OPERATION file)
                        ['test_server/src/http/nodegen/transformOutputs/weatherTransformOutput.ts', '14d4332f20b73acc928509109f55d781'],
                        // Check dynamic docker file (OTHER file)
                        ['test_server/docker-compose.yml', 'd553b06bbfc2fb3e9f4fa92dd293b4c1'],
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
