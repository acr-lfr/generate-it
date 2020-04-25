"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var generateIt_1 = tslib_1.__importDefault(require("../generateIt"));
jest.setTimeout(60 * 1000); // in milliseconds
var testServerName = 'test_server_2';
var testServerPath = path_1["default"].join(process.cwd(), testServerName);
exports.tplUrl = 'https://github.com/acrontum/openapi-nodegen-typescript-server.git';
exports.clearTestServer = function () {
    fs_extra_1["default"].removeSync(testServerName);
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
                    return [4 /*yield*/, generateIt_1["default"]({
                            dontRunComparisonTool: false,
                            dontUpdateTplCache: false,
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
});
