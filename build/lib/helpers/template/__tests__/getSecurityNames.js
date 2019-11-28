"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var getSecurityNames_1 = tslib_1.__importDefault(require("../getSecurityNames"));
var fullSwaggerObject = {
    securityDefinitions: {
        apiKey: {
            type: 'apiKey',
            name: 'api-key',
            "in": 'header'
        },
        jwtToken: {
            type: 'apiKey',
            name: 'Authorization',
            "in": 'header'
        }
    }
};
it('should return empty string a path obj without security', function () {
    var pathObj = {};
    expect(getSecurityNames_1["default"](pathObj, fullSwaggerObject)).toBe('');
});
it('should return empty string for invalid security in path', function () {
    var pathObj = {
        security: [{
                bb: []
            }]
    };
    expect(getSecurityNames_1["default"](pathObj, fullSwaggerObject)).toBe('');
});
it('should return array', function () {
    var pathObj = {
        security: [{
                jwtToken: []
            }]
    };
    expect(getSecurityNames_1["default"](pathObj, fullSwaggerObject)).toBe("['Authorization']");
});
it('should return array with all values', function () {
    var pathObj = {
        security: [{
                jwtToken: [],
                apiKey: []
            }]
    };
    expect(getSecurityNames_1["default"](pathObj, fullSwaggerObject)).toBe("['Authorization', 'api-key']");
});
it('should return array with all values in alternate order', function () {
    var pathObj = {
        security: [{
                apiKey: [],
                jwtToken: []
            }]
    };
    expect(getSecurityNames_1["default"](pathObj, fullSwaggerObject)).toBe("['api-key', 'Authorization']");
});
