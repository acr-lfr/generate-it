import OpenAPIInjectInterfaceNaming from '@/lib/openapi/OpenAPIInjectInterfaceNaming';
import { mockConfig } from '@/__mocks__/mockConfig';
import { JSONSchema } from 'json-schema-ref-parser';

const swagger2obj = {
  swagger: '2.0',
};
const initialisedSwagger = new OpenAPIInjectInterfaceNaming(swagger2obj, mockConfig);

const openApiobj = {
  openapi: '3.0.0',
};
const initialisedOpenApi = new OpenAPIInjectInterfaceNaming(openApiobj, mockConfig);

const requestParam: JSONSchema = {
  in: 'query',
  name: 'term',
  schema: { type: 'string' },
  description: 'Search term',
  type: 'string'
};

describe('Initialise and validate file type checks', () => {
  it('Should inject a Swagger object', () => {
    expect(initialisedSwagger.apiObject).toEqual(swagger2obj);
  });

  it('Should inject an OpenAPI object', () => {
    expect(initialisedOpenApi.apiObject).toEqual(openApiobj);
  });

  it('Should convert required parameters to proper schema object', () => {
    expect(
      initialisedOpenApi.convertRequestParamsToSchemaObject({
        term: requestParam
      })
    ).toEqual({
      type: 'object',
      required: [],
      properties: {
        term: requestParam
      }
    });
  });

  it('Should convert non required parameters to proper schema object', () => {
    expect(
      initialisedOpenApi.convertRequestParamsToSchemaObject({
        term: {
          required: true,
          ...requestParam
        }
      })
    ).toEqual({
      type: 'object',
      required: ['term'],
      properties: {
        term: requestParam
      }
    });
  });
});
