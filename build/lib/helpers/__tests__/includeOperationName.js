"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var includeOperationName_1 = tslib_1.__importDefault(require("../includeOperationName"));
describe('includeOperationName', function () {
    it('should return true', function () {
        expect(includeOperationName_1["default"]('ms-auth', {
            'nodegenDir': 'generated',
            'nodegenMockDir': '/__mocks__',
            'nodegenType': 'server',
            'helpers': {
                'operationNames': {
                    'include': ['ms-auth']
                }
            }
        })).toBe(true);
    });
    it('should return false', function () {
        expect(includeOperationName_1["default"]('ms-images', {
            'nodegenDir': 'generated',
            'nodegenMockDir': '/__mocks__',
            'nodegenType': 'server',
            'helpers': {
                'operationNames': {
                    'include': ['ms-auth']
                }
            }
        })).toBe(false);
    });
    it('should return false', function () {
        expect(includeOperationName_1["default"]('ms-images', {
            'nodegenDir': 'generated',
            'nodegenMockDir': '/__mocks__',
            'nodegenType': 'server',
            'helpers': {
                'operationNames': {
                    'exclude': ['ms-auth']
                }
            }
        })).toBe(true);
    });
    it('should return false', function () {
        expect(includeOperationName_1["default"]('ms-images', {
            'nodegenDir': 'generated',
            'nodegenMockDir': '/__mocks__',
            'nodegenType': 'server',
            'helpers': {
                'operationNames': {
                    'exclude': ['ms-images']
                }
            }
        })).toBe(false);
    });
    it('should return false', function () {
        expect(includeOperationName_1["default"]('ms-images', {
            'nodegenDir': 'generated',
            'nodegenMockDir': '/__mocks__',
            'nodegenType': 'server'
        })).toBe(true);
    });
});
