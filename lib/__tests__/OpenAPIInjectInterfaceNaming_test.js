const OpenAPIInjectInterfaceNaming = require('../OpenAPIInjectInterfaceNaming')

const swagger2obj = {
  swagger: '2.0',
}
const initialisedSwagger = new OpenAPIInjectInterfaceNaming(swagger2obj)
const openApiobj = {
  openapi: '3.0.0',
}
const initialisedOpenApi = new OpenAPIInjectInterfaceNaming(openApiobj)

describe('Initialise and validate file type checks', () => {
  it('Should inject an open api object', () => {
    expect(initialisedSwagger.apiObject).toEqual(swagger2obj)
  })

  it('isSwagger should accept swagger', () => {
    expect(initialisedSwagger.isSwagger()).toBe(true)
  })
  it('isSwagger should not accept openapi', () => {
    expect(initialisedOpenApi.isSwagger()).toBe(false)
  })
  it('isOpenAPI3 should accept openapi', () => {
    expect(initialisedOpenApi.isOpenAPI3()).toBe(true)
  })
  it('isOpenAPI3 should not accept swagger', () => {
    expect(initialisedSwagger.isOpenAPI3()).toBe(false)
  })
})
