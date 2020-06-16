"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var generateTypeScriptInterfaceText_1 = tslib_1.__importDefault(require("../generateTypeScriptInterfaceText"));
describe('generateTypeScriptInterfaceText', function () {
    it('should convert a schema to the correct type', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var output;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"]('Person', "\n    {\n      \"type\": \"object\",\n      \"properties\": { \"lon\": { \"type\": \"number\" }, \"lat\": { \"type\": \"number\" } }\n    }\n    ")];
                case 1:
                    output = _a.sent();
                    expect(output.outputString.trim()).toBe('export interface Person {\n' +
                        '    lat?: number;\n' +
                        '    lon?: number;\n' +
                        '}');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should convert a string schema to the correct type', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var output;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"]('UserId', "\n    {\n      \"type\": \"string\"\n    }\n    ")];
                case 1:
                    output = _a.sent();
                    expect(output.outputString.trim()).toBe('export type UserId = string;');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should convert an array schema to the correct type', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var output;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"]('UserId', "\n    {\n      \"type\": \"array\",\n      \"items\": {\n        \"type\": \"string\"\n      }\n    }\n    ")];
                case 1:
                    output = _a.sent();
                    expect(output.outputString.trim()).toBe('export type UserId = string[];');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should convert an array schema with top level description to the correct type', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var output;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"]('NamibianCities', "\n    {\n      \"type\": \"array\",\n      \"description\": \"Some weird very long description about Namibian cities\",\n      \"summary\": \"This is a summary about Namibian Cities\",\n      \"items\": {\n        \"type\": \"string\"\n      }\n    }\n    ")];
                case 1:
                    output = _a.sent();
                    expect(output.outputString.trim()).toBe('export type NamibianCities = string[];');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should convert an additionalProperties object schema to the correct type', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var output;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"]('UserMap', "\n    {\n      \"type\": \"object\",\n      \"additionalProperties\": {\n        \"type\": \"string\"\n      }\n    }\n    ")];
                case 1:
                    output = _a.sent();
                    expect(output.outputString.trim()).toBe('export type UserMap = { [key: string]: string };');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should convert an object array schema to the correct type', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var output;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateTypeScriptInterfaceText_1["default"]('Users', "\n    {\n      \"type\": \"array\",\n      \"items\": {\n        \"type\": \"object\",\n        \"properties\": {\n          \"name\": {\n            \"type\": \"string\"\n          }\n        }\n      }\n    }\n    ")];
                case 1:
                    output = _a.sent();
                    expect(output.outputString.trim()).toBe('export type Users = User[];\n\n' +
                        'export interface User {\n' +
                        '    name?: string;\n' +
                        '}');
                    return [2 /*return*/];
            }
        });
    }); });
});
