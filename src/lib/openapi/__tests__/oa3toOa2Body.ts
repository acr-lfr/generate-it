import oa3toOa2Body from '@/lib/openapi/oa3toOa2Body';

describe('should return a path object with the requestBody injected into the parameters or leave the params alone', function () {
  it('should work with responseBody', function () {
    const input: any = {
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/WeatherPost',
            },
          },
        },
      },
    };
    const result = oa3toOa2Body('POST', input);
    expect(result.parameters.length).toBe(1);
  });
  it('should work with responseBody and leave existing parameters untouched', function () {
    const input: any = {
      parameters: [
        {
          in: 'query',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/WeatherPost',
            },
          },
        },
      },
    };
    const result = oa3toOa2Body('POST', input);
    expect(result.parameters.length).toBe(2);
  });
});
