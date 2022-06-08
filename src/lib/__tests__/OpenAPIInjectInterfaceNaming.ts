
import { ConfigExtendedBase } from '@/interfaces';
import OpenAPIInjectInterfaceNaming from '@/lib/openapi/OpenAPIInjectInterfaceNaming';
import { mockConfig } from '@/__mocks__/mockConfig';

const swagger2obj = {
  swagger: '2.0',
};
const initialisedSwagger = new OpenAPIInjectInterfaceNaming(swagger2obj, mockConfig);
const openApiobj = {
  openapi: '3.0.0',
};
const initialisedOpenApi = new OpenAPIInjectInterfaceNaming(openApiobj, mockConfig);

describe('Initialise and validate file type checks', () => {
  it('Should inject an open api object', () => {
    expect(initialisedSwagger.apiObject).toEqual(swagger2obj);
  });
});
