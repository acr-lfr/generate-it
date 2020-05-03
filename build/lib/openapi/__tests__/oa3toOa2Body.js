"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var oa3toOa2Body_1 = tslib_1.__importDefault(require("../oa3toOa2Body"));
describe('should return a path object with the requestBody injected into the parameters or leave the params alone', function () {
    it('should work with responseBody', function () {
        var input = {
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/WeatherPost'
                        }
                    }
                }
            }
        };
        var result = oa3toOa2Body_1["default"]('POST', input);
        expect(result.parameters.length).toBe(1);
    });
    it('should work with responseBody and leave existing parameters untouched', function () {
        var input = {
            parameters: [{
                    "in": 'query'
                }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/WeatherPost'
                        }
                    }
                }
            }
        };
        var result = oa3toOa2Body_1["default"]('POST', input);
        expect(result.parameters.length).toBe(2);
    });
});
