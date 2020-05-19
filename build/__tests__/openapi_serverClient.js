"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var path_1 = tslib_1.__importDefault(require("path"));
var generateIt_1 = tslib_1.__importDefault(require("../generateIt"));
var helpers_1 = require("./helpers");
jest.setTimeout(60 * 1000); // in milliseconds
var testServerPath = path_1["default"].join(process.cwd(), 'test_server_client');
var testClientPath = path_1["default"].join(testServerPath, 'src/services/openweathermap');
var ymlPath = path_1["default"].join(process.cwd(), 'test_swagger.yml');
describe('e2e testing', function () {
    beforeAll(function () {
        helpers_1.clearTestServer();
    });
    afterAll(function () {
        // clearTestServer();
    });
    it('Should build without error', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, generateIt_1["default"]({
                            dontRunComparisonTool: true,
                            dontUpdateTplCache: true,
                            mockServer: false,
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
    it('Should build the client', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, generateIt_1["default"]({
                            dontRunComparisonTool: true,
                            dontUpdateTplCache: true,
                            mockServer: false,
                            segmentsCount: 1,
                            swaggerFilePath: ymlPath,
                            targetDir: testClientPath,
                            template: helpers_1.tplClientServer
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
    it('should edit the client, regen and see the edit still present', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var checkPath, templateStr;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkPath = path_1["default"].join(testClientPath, 'lib/HttpService.ts');
                    fs_1["default"].writeFileSync(checkPath, '//', 'utf8');
                    return [4 /*yield*/, generateIt_1["default"]({
                            dontRunComparisonTool: true,
                            dontUpdateTplCache: true,
                            mockServer: false,
                            segmentsCount: 1,
                            swaggerFilePath: ymlPath,
                            targetDir: testClientPath,
                            template: helpers_1.tplClientServer
                        })];
                case 1:
                    _a.sent();
                    templateStr = fs_1["default"].readFileSync(checkPath).toString('utf8');
                    expect(templateStr).toBe('//');
                    return [2 /*return*/];
            }
        });
    }); });
});
