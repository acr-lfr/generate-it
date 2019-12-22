"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var openapiNodegen_1 = tslib_1.__importDefault(require("../openapiNodegen"));
var hasha_1 = tslib_1.__importDefault(require("hasha"));
jest.setTimeout(60 * 1000); // in milliseconds
var testServerPath = path_1["default"].join(process.cwd(), 'testserver');
var packageJson = {
    name: 'openapi-nodegen',
    version: '4.0.6',
    description: 'An OpenAPI 2/3 code generator for Node.js',
    scripts: {},
    devDependencies: {
        'openapi-nodegen': 'latest'
    }
};
var tplUrl = 'https://github.com/acrontum/openapi-nodegen-typescript-server.git';
describe('e2e testing', function () {
    beforeAll(function () {
        fs_extra_1["default"].removeSync(testServerPath);
        fs_extra_1["default"].ensureDirSync(testServerPath);
        fs_extra_1["default"].writeJsonSync(path_1["default"].join(testServerPath, 'package.json'), packageJson, { spaces: 2 });
    });
    afterAll(function () {
        return fs_extra_1["default"].removeSync(testServerPath);
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
                            dontUpdateTplCache: false,
                            mockServer: true,
                            segmentsCount: 1,
                            swaggerFilePath: ymlPath,
                            targetDir: testServerPath,
                            template: tplUrl
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
                    // remove a servive file which should then be copied back over
                    fs_extra_1["default"].removeSync(path_1["default"].join(process.cwd(), 'testserver/src/services/HttpHeadersCacheService.ts'));
                    ymlPath = path_1["default"].join(process.cwd(), 'test_swagger.yml');
                    return [4 /*yield*/, openapiNodegen_1["default"]({
                            dontRunComparisonTool: false,
                            dontUpdateTplCache: false,
                            mockServer: true,
                            segmentsCount: 1,
                            swaggerFilePath: ymlPath,
                            targetDir: testServerPath,
                            template: tplUrl
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
        var filePaths, mismatched, i, filePath, fileHash, hash;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePaths = [
                        // Check generated domains (STUB file)
                        ['testserver/src/domains/RainDomain.ts', '63755a585c2c862d6ef7602d8a24dc9f'],
                        // Check complex interface (INTERFACE file)
                        ['testserver/src/http/nodegen/interfaces/WeatherFull.ts', '3b5de54103373a6f2e1d6945c0c1c66e'],
                        // Check the interface index file (OTHER file)
                        ['testserver/src/http/nodegen/interfaces/index.ts', '0e5a6b1bfad08b8c378be83a6b4c436c'],
                        // Check the security definition files (OTHER file)
                        ['testserver/src/http/nodegen/security/definitions.ts', 'c14f49726b33f9ee55074fa0bc496bf5'],
                        // Check the generated routes files (OPERATION file)
                        ['testserver/src/http/nodegen/routes/rainRoutes.ts', '14a1aaff4a0919e978196c0da3014ce2'],
                        ['testserver/src/http/nodegen/routes/weatherRoutes.ts', '41181409d237ef89991f65dc5329bdd0'],
                        // Check the output transformers (OPERATION file)
                        ['testserver/src/http/nodegen/transformOutputs/weatherTransformOutput.ts', '14d4332f20b73acc928509109f55d781'],
                        // Check dynamic docker file (OTHER file)
                        ['testserver/docker-compose.yml', 'd553b06bbfc2fb3e9f4fa92dd293b4c1'],
                        // Check git ignore was copied over (OTHER file)
                        ['testserver/.gitignore', 'f4f0aea2df6293d79666f3c7c622d45c'],
                        // Check the deleted service file was reinjected
                        ['testserver/src/services/HttpHeadersCacheService.ts', '144cd39920fd8e042a57f83628479979'],
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
                        mismatched.push("Hash mis-match for file " + filePath + ". Expected hash " + fileHash + " but got " + hash);
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
