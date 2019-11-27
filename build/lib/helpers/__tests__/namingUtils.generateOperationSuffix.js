"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var NamingUtils_1 = tslib_1.__importDefault(require("../NamingUtils"));
var generateOperationSuffix = NamingUtils_1["default"].generateOperationSuffix;
it('should return customerTransformOutput.ts', function () {
    expect(generateOperationSuffix('src/http/nodegen/transformOutputs', 'customer', 'ts')).toBe('customerTransformOutput.ts');
});
it('should return customerRoutes.ts', function () {
    expect(generateOperationSuffix('src/http/nodegen/routes', 'customer', 'ts')).toBe('customerRoutes.ts');
});
