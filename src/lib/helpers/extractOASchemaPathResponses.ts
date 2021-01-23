export default (input: any) => {
  // async api 2 check
  if (input?.type || input?.properties) {
    return input;
  }

  // Handle response outputs for openapi
  const successResponse = Object.entries(input).find(([statusCode, reponse]) => /2\d\d/.test(statusCode));

  if (!successResponse?.[1]) {
    return {};
  }

  const [code, response] = successResponse as [string, { schema: any, content: any }];

  if (response.schema) {  // we are oa2
    return response.schema;
  } else if (response.content) {  // we are oa3
    // prefer application/json, otherwise return the first content-type in the list
    const contentSchema = response.content['application/json'] || Object.entries(response.content)[0][1];

    return contentSchema?.schema || contentSchema;
  }

  // We also check if the input contains any valid OA schema by looking for type or properties in the provided object
  // The typical use case here if for async api payloads
  return (input?.type || input?.properties) ? input : {};
};
