
import OpenAPIInjectInterfaceNaming from '@/lib/openapi/OpenAPIInjectInterfaceNaming';

const swagger2obj = {
  swagger: '2.0',
};
const initialisedSwagger = new OpenAPIInjectInterfaceNaming(swagger2obj);
const openApiobj = {
  openapi: '3.0.0',
};
const initialisedOpenApi = new OpenAPIInjectInterfaceNaming(openApiobj);

describe('Initialise and validate file type checks', () => {
  it('Should inject an open api object', () => {
    expect(initialisedSwagger.apiObject).toEqual(swagger2obj);
  });
});
