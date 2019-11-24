"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const NamingUtils_1 = tslib_1.__importDefault(require("../NamingUtils"));
const generateOperationSuffix = NamingUtils_1.default.generateOperationSuffix;
it('should return customerTransformOutput.ts', () => {
    expect(generateOperationSuffix('src/http/nodegen/transformOutputs', 'customer', 'ts')).toBe('customerTransformOutput.ts');
});
it('should return customerRoutes.ts', () => {
    expect(generateOperationSuffix('src/http/nodegen/routes', 'customer', 'ts')).toBe('customerRoutes.ts');
});
//# sourceMappingURL=namingUtils.generateOperationSuffix.js.map