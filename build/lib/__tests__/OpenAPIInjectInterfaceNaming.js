"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const OpenAPIInjectInterfaceNaming_1 = tslib_1.__importDefault(require("../OpenAPIInjectInterfaceNaming"));
const swagger2obj = {
    swagger: '2.0',
};
const initialisedSwagger = new OpenAPIInjectInterfaceNaming_1.default(swagger2obj);
const openApiobj = {
    openapi: '3.0.0',
};
const initialisedOpenApi = new OpenAPIInjectInterfaceNaming_1.default(openApiobj);
describe('Initialise and validate file type checks', () => {
    it('Should inject an open api object', () => {
        expect(initialisedSwagger.apiObject).toEqual(swagger2obj);
    });
    it('isSwagger should accept swagger', () => {
        expect(initialisedSwagger.isSwagger()).toBe(true);
    });
    it('isSwagger should not accept openapi', () => {
        expect(initialisedOpenApi.isSwagger()).toBe(false);
    });
    it('isOpenAPI3 should accept openapi', () => {
        expect(initialisedOpenApi.isOpenAPI3()).toBe(true);
    });
    it('isOpenAPI3 should not accept swagger', () => {
        expect(initialisedSwagger.isOpenAPI3()).toBe(false);
    });
});
