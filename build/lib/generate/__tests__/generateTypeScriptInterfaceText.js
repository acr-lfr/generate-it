"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var generateTypeScriptInterfaceText_1 = tslib_1.__importDefault(require("../generateTypeScriptInterfaceText"));
it('should not trow an error', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var output;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"]('Person', "\n    {\n      type: 'object',\n      properties: { lon: { type: 'number' }, lat: { type: 'number' } }\n    }\n    ")];
            case 1:
                output = _a.sent();
                expect(output.outputString).toBe("export interface Person {\n    lat?: number;\n    lon?: number;\n}\n\n");
                return [2 /*return*/];
        }
    });
}); });
