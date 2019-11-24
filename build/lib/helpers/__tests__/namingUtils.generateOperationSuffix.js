const generateOperationSuffix = require('../NamingUtils').generateOperationSuffix;
it('should return customerTransformOutput.ts', () => {
    expect(generateOperationSuffix('src/http/nodegen/transformOutputs', 'customer', 'ts')).toBe('customerTransformOutput.ts');
});
it('should return customerRoutes.ts', () => {
    expect(generateOperationSuffix('src/http/nodegen/routes', 'customer', 'ts')).toBe('customerRoutes.ts');
});
