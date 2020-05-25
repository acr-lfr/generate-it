"use strict";
exports.__esModule = true;
exports.tplUrl = void 0;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var generateIt_1 = tslib_1.__importDefault(require("../generateIt"));
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
        // clearTestServer(serverDir);
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
    it('should return the correct hash for the domain folder', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var options, hash;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        files: { include: ['*.ts'] }
                    };
                    return [4 /*yield*/, hashElement(testServerPath, options)];
                case 1:
                    hash = _a.sent();
                    expect(hash.hash).toBe('+l0qbqc4Jbkw1LyBlZk3MKcHUK0=');
                    return [2 /*return*/];
            }
        });
    }); });
});
