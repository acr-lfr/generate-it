"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var cli_1 = require("../../constants/cli");
var _a = require('quicktype/dist/quicktype-core'), InputData = _a.InputData, JSONSchemaInput = _a.JSONSchemaInput, JSONSchemaStore = _a.JSONSchemaStore, quicktype = _a.quicktype;
exports["default"] = (function (name, schema) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var schemaInput, inputData, interfaceContent, interfaceReturnString;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                schemaInput = new JSONSchemaInput(new JSONSchemaStore());
                return [4 /*yield*/, schemaInput.addSource({
                        name: name,
                        schema: schema
                    })];
            case 1:
                _a.sent();
                inputData = new InputData();
                inputData.addInput(schemaInput);
                return [4 /*yield*/, quicktype({
                        inputData: inputData,
                        lang: 'ts',
                        rendererOptions: {
                            'just-types': true,
                            'acronym-style': 'original'
                        }
                    })];
            case 2:
                interfaceContent = _a.sent();
                interfaceReturnString = '';
                interfaceContent.lines.forEach(function (line) {
                    interfaceReturnString += line + cli_1.LINEBREAK;
                });
                return [2 /*return*/, {
                        outputString: interfaceReturnString
                    }];
        }
    });
}); });
