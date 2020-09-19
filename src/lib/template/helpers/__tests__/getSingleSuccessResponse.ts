import getSingleSuccessResponse from '@/lib/template/helpers/getSingleSuccessResponse';

const responseObject = {
  description: 'description',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'id' },
      text: { type: 'string', description: 'text' },
      url: { type: 'string', description: 'url' },
    },
  },
};

const buildResponses = (codes: (number | string)[]): { [key: string]: object; [key: number]: object; } =>
  (codes || []).reduce((responses, code) =>
    Object.assign(responses, {
      [typeof code === 'number' ? code : `${code}`]: responseObject
    }),
    {}
  );

const asStrings = (codes: number[]) => (codes || []).map(String);

describe('getSingleSuccessResponse helper', () => {
  it('can extract 200-level codes', async () => {
    const testCodes = [
      [100, 200, 300, 400, 500],
      [100, 201, 300, 400, 500],
      [202, 500],
      [203],
      [204],
      [205, 100],
      [500, 206],
    ];

    let apiObj = buildResponses(testCodes[0]);
    let responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(200);
    apiObj = buildResponses(asStrings(testCodes[0]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(200);

    apiObj = buildResponses(testCodes[1]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(201);
    apiObj = buildResponses(asStrings(testCodes[1]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(201);

    apiObj = buildResponses(testCodes[2]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(202);
    apiObj = buildResponses(asStrings(testCodes[2]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(202);

    apiObj = buildResponses(testCodes[3]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(203);
    apiObj = buildResponses(asStrings(testCodes[3]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(203);

    apiObj = buildResponses(testCodes[4]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(204);
    apiObj = buildResponses(asStrings(testCodes[4]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(204);

    apiObj = buildResponses(testCodes[5]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(205);
    apiObj = buildResponses(asStrings(testCodes[5]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(205);

    apiObj = buildResponses(testCodes[6]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(206);
    apiObj = buildResponses(asStrings(testCodes[6]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(206);
  });

  it('returns nothing when there are multiple 200-level codes', async () => {
    const testCodes = [
      [100, 200, 201, 300, 400, 500],
      [100, 201, 202, 300, 400, 500],
      [202, 203, 500],
      [203, 204],
      [204, 205],
      [205, 204],
      [206, 205, 100],
      [500, 418, 200, 206],
    ];

    let apiObj = buildResponses(testCodes[0]);
    let responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[0]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[1]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[1]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[2]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[2]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[3]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[3]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[4]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[4]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[5]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[5]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[6]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[6]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[7]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[7]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
  });

  it('returns nothing when there are no 200-level codes', async () => {
    const testCodes = [
      [100, 300, 400, 500],
      [100, 300, 400, 500],
      [418, 500],
      [100, 301, 422, 512],
      [503, 418, 100],
      [],
    ];

    let apiObj = buildResponses(testCodes[0]);
    let responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[0]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[1]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[1]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[2]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[2]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[3]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[3]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[4]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[4]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);

    apiObj = buildResponses(testCodes[5]);
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
    apiObj = buildResponses(asStrings(testCodes[5]));
    responseCode = getSingleSuccessResponse(apiObj);
    expect(responseCode).toBe(undefined);
  });
});
