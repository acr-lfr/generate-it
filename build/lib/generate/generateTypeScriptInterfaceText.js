"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var cli_1 = require("../../constants/cli");
var _a = require('quicktype/dist/quicktype-core'), InputData = _a.InputData, JSONSchemaInput = _a.JSONSchemaInput, JSONSchemaStore = _a.JSONSchemaStore, quicktype = _a.quicktype;
var countNoOfMatches = function (name, line) {
    var regex = new RegExp(name, 'gi');
    return ((line || '').match(regex) || []).length;
};
exports["default"] = (function (name, schema) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var schemaInput, inputData, interfaceContent, interfaceReturnString, skipUntil;
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                schemaInput = new JSONSchemaInput(new JSONSchemaStore());
                return [4 /*yield*/, schemaInput.addSource({
                        name: '___Nodegen',
                        schema: JSON.stringify({
                            type: 'object',
                            properties: (_a = {},
                                _a[name] = schema ? JSON.parse(schema) : schema,
                                _a)
                        })
                    })];
            case 1:
                _b.sent();
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
                interfaceContent = _b.sent();
                interfaceReturnString = '';
                skipUntil = interfaceContent.lines.findIndex(function (line) { return line && line.includes(name + '?:'); });
                interfaceContent.lines.forEach(function (line, i) {
                    if (i < skipUntil || i === skipUntil + 1) {
                        return;
                    }
                    if (i === skipUntil) {
                        if (countNoOfMatches(name, line) === 2) {
                            return;
                        }
                        line = 'export type ' + name + line.trim().replace(name + '?:', ' =');
                    }
                    interfaceReturnString += line + cli_1.LINEBREAK;
                });
                return [2 /*return*/, {
                        outputString: interfaceReturnString
                    }];
        }
    });
}); });
