import { default as getBaseUrl, OASpec } from '@/lib/helpers/getBaseUrl';

describe('getBaseUrl template helper', () => {
  const specFromUrls = (urls: string | string[]): OASpec => {
    return {
      servers: Array.isArray(urls) ? urls.map((url) => ({ url })) : [{ url: urls }],
    };
  };

  it('will read baseUrl from OA2 / swag if present', async () => {
    const oaSpec = {
      basePath: '/this/is/a/test',
      servers: [{ url: 'not technically valid but is ignored' }]
    };
    expect(getBaseUrl(oaSpec)).toBe('/this/is/a/test');
  });

  it('can parse OA3 servers', () => {
    // from OA3 https://swagger.io/docs/specification/api-host-and-base-path/
    let oaSpec = specFromUrls('https://api.example.com');
    expect(getBaseUrl(oaSpec)).toBe('/');

    oaSpec = specFromUrls('https://api.example.com:8443/v1/reports');
    expect(getBaseUrl(oaSpec)).toBe('/v1/reports');

    oaSpec = specFromUrls('http://localhost:3025/v1');
    expect(getBaseUrl(oaSpec)).toBe('/v1');

    oaSpec = specFromUrls('http://10.0.81.36/v1');
    expect(getBaseUrl(oaSpec)).toBe('/v1');

    oaSpec = specFromUrls('ws://api.example.com/v1');
    expect(getBaseUrl(oaSpec)).toBe('/v1');

    oaSpec = specFromUrls('wss://api.example.com/v1');
    expect(getBaseUrl(oaSpec)).toBe('/v1');

    oaSpec = specFromUrls('/v1/reports');
    expect(getBaseUrl(oaSpec)).toBe('/v1/reports');

    oaSpec = specFromUrls('/');
    expect(getBaseUrl(oaSpec)).toBe('/');

    oaSpec = specFromUrls('//api.example.com');
    expect(getBaseUrl(oaSpec)).toBe('/');
  });

  it('returns a common base path for OA3 servers', async () => {
    const oaSpec = specFromUrls([
      'http://localhost:3025/v1',
      'http://10.0.81.36/v1',
      'ws://api.example.com/v1',
      'wss://api.example.com/v1',
    ]);

    expect(getBaseUrl(oaSpec)).toBe('/v1');
  });

  it(`returns '/' when no common base path is found`, async () => {
    const oaSpec = specFromUrls([
      'http://localhost:3025/v1',
      'http://10.0.81.36/v1',
      'ws://api.example.com/v1',
      'wss://api.example.com/v1',
      '/v1/reports',
    ]);

    expect(getBaseUrl(oaSpec)).toBe('/');
  });
});
