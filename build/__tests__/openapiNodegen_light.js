"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var openapiNodegen_1 = tslib_1.__importDefault(require("../openapiNodegen"));
var hasha_1 = tslib_1.__importDefault(require("hasha"));
var openapiNodegen_full_1 = require("./openapiNodegen_full");
jest.setTimeout(60 * 1000); // in milliseconds
var testServerPath = path_1["default"].join(process.cwd(), 'test_server');
describe('e2e testing', function () {
    beforeAll(function () {
        openapiNodegen_full_1.clearTestServer();
    });
    afterAll(function () {
        openapiNodegen_full_1.clearTestServer();
    });
    it('Should build without error', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var ymlPath, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    ymlPath = path_1["default"].join(process.cwd(), 'test_swagger2.yml');
                    return [4 /*yield*/, openapiNodegen_1["default"]({
                            dontRunComparisonTool: false,
                            dontUpdateTplCache: true,
                            mockServer: true,
                            segmentsCount: 1,
                            swaggerFilePath: ymlPath,
                            targetDir: testServerPath,
                            template: openapiNodegen_full_1.tplUrl
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
                    ymlPath = path_1["default"].join(process.cwd(), 'test_swagger2.yml');
                    return [4 /*yield*/, openapiNodegen_1["default"]({
                            dontRunComparisonTool: false,
                            dontUpdateTplCache: true,
                            mockServer: true,
                            segmentsCount: 1,
                            swaggerFilePath: ymlPath,
                            targetDir: testServerPath,
                            template: openapiNodegen_full_1.tplUrl
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
                        ['test_server/src/domains/AdminDomain.ts', 'c35bbf396d58fb025bbb6a87bd0db710'],
                        ['test_server/src/domains/AuthDomain.ts', 'e5a6d8f324a10e37cca008ae74108a1c'],
                        // Check the interface index file (OTHER file)
                        ['test_server/src/http/nodegen/interfaces/index.ts', '108b13afd431e1d848c7c214abaa3418'],
                        // Check the generated routes files (OPERATION file)
                        ['test_server/src/http/nodegen/routes/adminRoutes.ts', 'e9ddb2ea044a34adfb024213df51d88c'],
                        ['test_server/src/http/nodegen/routes/authRoutes.ts', '92ddb270ea5a6df79888ee1dd208d784'],
                        // Check the output transformers (OPERATION file)
                        ['test_server/src/http/nodegen/transformOutputs/authTransformOutput.ts', '7198aaa6028e58c086377b802e9e4ea2'],
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
