import NamingUtils from '@/lib/helpers/NamingUtils';

const generateOperationSuffix = NamingUtils.generateOperationSuffix;

it('should return customerTransformOutput.ts', () => {
  expect(
    generateOperationSuffix('src/http/nodegen/transformOutputs', 'customer', 'ts'),
  ).toBe('customerTransformOutput.ts');
});

it('should return customerRoutes.ts', () => {
  expect(
    generateOperationSuffix('src/http/nodegen/routes', 'customer', 'ts'),
  ).toBe('customerRoutes.ts');
});

it('should return B2DDomainMock.ts', () => {
  expect(
    generateOperationSuffix('src/domains/__mocks__', 'b2d', 'ts'),
  ).toBe('B2DDomainMock.ts');
});
