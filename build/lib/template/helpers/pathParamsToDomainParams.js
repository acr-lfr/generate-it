"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ucFirst_1 = tslib_1.__importDefault(require("./ucFirst"));
function addType(withType, pathObject, requestType) {
    if (!withType) {
        return '';
    }
    if (requestType && pathObject['x-request-definitions'] && pathObject['x-request-definitions'][requestType]) {
        if (requestType === 'body') {
            return ': ' + ucFirst_1["default"](pathObject['x-request-definitions'][requestType].params[0].name);
        }
        return ': ' + pathObject['x-request-definitions'][requestType].name;
    }
    return ': any';
}
/**
 * Provides parameters for controller and domain functions.
 * Will auto inject the req.jwtData if the path has a security attribute.
 * @param pathObject The full value of the path object
 * @param {boolean | object} withType If true will inject the typescript type any
 * @param {boolean} withPrefix
 * @param pathNameChange
 * @returns {string}
 */
exports["default"] = (function (pathObject, withType, withPrefix, pathNameChange) {
    if (withType === void 0) { withType = false; }
    if (pathNameChange === void 0) { pathNameChange = 'path'; }
    if (!pathObject) {
        return '';
    }
    var params = [];
    if (pathObject.parameters) {
        if (pathObject.parameters.some(function (p) { return p["in"] === 'query'; })) {
            params.push('query' + addType(withType, pathObject, 'query'));
        }
        if (pathObject.parameters.some(function (p) { return p["in"] === 'path'; })) {
            params.push(pathNameChange + addType(withType, pathObject, 'path'));
        }
        if (pathObject.parameters.some(function (p) { return p["in"] === 'body'; })) {
            params.push('body' + addType(withType, pathObject, 'body'));
        }
        if (pathObject.parameters.some(function (p) { return p["in"] === 'headers'; })) {
            params.push('headers' + addType(withType, pathObject, 'headers'));
        }
        if (pathObject.parameters.some(function (p) { return p["in"] === 'formData'; })) {
            params.push('files' + addType(withType, pathObject, 'formData'));
        }
    }
    if (pathObject.security) {
        var push_1 = false;
        pathObject.security.forEach(function (security) {
            Object.keys(security).forEach(function (key) {
                if (key.toLowerCase().includes('jwt')) {
                    push_1 = true;
                }
            });
        });
        if (push_1) {
            params.push('jwtData' + addType(withType, pathObject));
        }
    }
    if (pathObject['x-passRequest']) {
        params.push('req' + addType(withType, pathObject));
    }
    params.sort();
    if (withPrefix) {
        params = params.map(function (p) { return (p === 'req') ? 'req' : 'req.' + p; });
    }
    return params.join(', ') + ((withType && params.length > 0) ? ',' : '');
});
