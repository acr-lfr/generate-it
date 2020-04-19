"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var OpenAPIInjectInterfaceNaming_1 = tslib_1.__importDefault(require("../openapi/OpenAPIInjectInterfaceNaming"));
var swagger2obj = {
    swagger: '2.0'
};
var initialisedSwagger = new OpenAPIInjectInterfaceNaming_1["default"](swagger2obj);
var openApiobj = {
    openapi: '3.0.0'
};
var initialisedOpenApi = new OpenAPIInjectInterfaceNaming_1["default"](openApiobj);
describe('Initialise and validate file type checks', function () {
    it('Should inject an open api object', function () {
        expect(initialisedSwagger.apiObject).toEqual(swagger2obj);
    });
});
