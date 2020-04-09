"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var versionCheck_1 = tslib_1.__importDefault(require("../versionCheck"));
it('should pass', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var thisVersion;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                thisVersion = require('../../../package.json').version;
                return [4 /*yield*/, versionCheck_1["default"](thisVersion)];
            case 1:
                _a.sent();
                done();
                return [2 /*return*/];
        }
    });
}); });
