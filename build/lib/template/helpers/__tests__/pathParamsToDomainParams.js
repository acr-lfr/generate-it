"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var pathParamsToDomainParams_1 = tslib_1.__importDefault(require("../pathParamsToDomainParams"));
describe('With req prefix', function () {
    it('Should return req.query', function () {
        var testObject = {
            parameters: [
                {
                    "in": 'query'
                },
            ]
        };
        var output = pathParamsToDomainParams_1["default"]('get', testObject, false, 'req');
        expect(output).toBe('req.query');
    });
    it('Should return req.body/path/query', function () {
        var testObject = {
            parameters: [
                {
                    "in": 'query'
                },
                {
                    "in": 'body'
                },
                {
                    "in": 'path'
                },
            ]
        };
        var output = pathParamsToDomainParams_1["default"]('post', testObject, false, 'req');
        expect(output).toBe('req.body, req.path, req.query');
    });
    it('Should return req.body/path/query with req', function () {
        var testObject = {
            'parameters': [
                {
                    "in": 'query'
                },
                {
                    "in": 'body'
                },
                {
                    "in": 'path'
                },
            ],
            'x-passRequest': true
        };
        var output = pathParamsToDomainParams_1["default"]('post', testObject, false, 'req');
        expect(output).toBe('req.body, req.path, req.query, req');
    });
});
describe('Without req prefix', function () {
    it('Should return req.query without security as name does not include jwt', function () {
        var testObject = {
            parameters: [
                {
                    "in": 'query'
                },
            ],
            security: [{
                    token: 1
                }]
        };
        var output = pathParamsToDomainParams_1["default"]('get', testObject, false);
        expect(output).toBe('query');
    });
    it('Should return req.query and security', function () {
        var testObject = {
            parameters: [
                {
                    "in": 'query'
                },
            ],
            security: [{
                    jwttoken: 1
                }]
        };
        var output = pathParamsToDomainParams_1["default"]('get', testObject, false);
        expect(output).toBe('jwtData, query');
    });
    it('Should return req.query', function () {
        var testObject = {
            parameters: [
                {
                    "in": 'query'
                },
            ]
        };
        var output = pathParamsToDomainParams_1["default"]('get', testObject, false);
        expect(output).toBe('query');
    });
    it('Should return req.body/path/query', function () {
        var testObject = {
            parameters: [
                {
                    "in": 'query'
                },
                {
                    "in": 'body'
                },
                {
                    "in": 'path'
                },
            ]
        };
        var output = pathParamsToDomainParams_1["default"]('post', testObject, false);
        expect(output).toBe('body, path, query');
    });
    it('Should return req.body/path/query with req', function () {
        var testObject = {
            'parameters': [
                {
                    "in": 'query'
                },
                {
                    "in": 'body'
                },
                {
                    "in": 'path'
                },
            ],
            'x-passRequest': true
        };
        var output = pathParamsToDomainParams_1["default"]('put', testObject, false);
        expect(output).toBe('body, path, query, req');
    });
});
