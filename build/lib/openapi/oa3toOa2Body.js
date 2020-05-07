"use strict";
exports.__esModule = true;
var lodash_1 = require("lodash");
exports["default"] = (function (method, fullPathMethod) {
    if (!fullPathMethod.requestBody) {
        return fullPathMethod;
    }
    try {
        var schema = void 0;
        if (fullPathMethod.requestBody.content['application/json']) {
            schema = fullPathMethod.requestBody.content['application/json'].schema;
        }
        if (fullPathMethod.requestBody.content['application/x-www-form-urlencoded']) {
            schema = fullPathMethod.requestBody.content['application/x-www-form-urlencoded'].schema;
        }
        fullPathMethod.parameters = fullPathMethod.parameters || [];
        fullPathMethod.parameters.push({
            "in": 'body',
            name: fullPathMethod.operationId + lodash_1.startCase(method),
            required: fullPathMethod.requestBody.required,
            schema: schema
        });
        return fullPathMethod;
    }
    catch (e) {
        console.log(fullPathMethod);
        console.error('Please pass body objects by reference to a component', e);
        throw e;
    }
});
