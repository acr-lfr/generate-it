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
        var tplUrl, ymlPath, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    tplUrl = 'https://github.com/acrontum/openapi-nodegen-typescript-server.git';
                    ymlPath = path_1["default"].join(process.cwd(), 'test_swagger.yml');
                    return [4 /*yield*/, openapiNodegen_1["default"]({
                            dontUpdateTplCache: false,
                            mockServer: false,
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
    it('Should have the correct file hashes', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var filePaths, i, filePath, fileHash, hash;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePaths = [
                        ['testserver/src/domains/RainDomain.ts', 'f768ac3c949e6d77aff47810f0150a23'],
                        ['testserver/src/http/nodegen/interfaces/WeatherFull.ts', '3b5de54103373a6f2e1d6945c0c1c66e'],
                        ['testserver/src/http/nodegen/interfaces/index.ts', '0e5a6b1bfad08b8c378be83a6b4c436c'],
                        ['testserver/src/http/nodegen/security/definitions.ts', 'c14f49726b33f9ee55074fa0bc496bf5'],
                        ['testserver/src/http/nodegen/routes/weatherRoutes.ts', '7b02f2da8180e6ca2334433d2eae3b2c'],
                        ['testserver/src/http/nodegen/transformOutputs/weatherTransformOutput.ts', '14d4332f20b73acc928509109f55d781'],
                    ];
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
                        done("Hash mis-match for file " + filePath + ". Expected hash " + fileHash + " but got " + hash);
                    }
                    _a.label = 3;
                case 3:
                    ++i;
                    return [3 /*break*/, 1];
                case 4:
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should build without error', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var tplUrl, ymlPath, e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    tplUrl = 'https://github.com/acrontum/openapi-nodegen-typescript-server.git';
                    ymlPath = path_1["default"].join(process.cwd(), 'test_swagger.yml');
                    return [4 /*yield*/, openapiNodegen_1["default"]({
                            dontUpdateTplCache: false,
                            mockServer: false,
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
});
