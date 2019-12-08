"use strict";
exports.__esModule = true;
function addType(withType, pathObject, requestType) {
    if (!withType) {
        return '';
    }
    if (requestType && pathObject['x-request-definitions'] && pathObject['x-request-definitions'][requestType]) {
        return ': ' + pathObject['x-request-definitions'][requestType].name;
    }
    return ': any';
}
/**
 * Provides parameters for controller and domain functions.
 * Will auto inject the req.jwtData if the path has a security attribute.
 * @param value The full value of the path object
 * @param {boolean | object} withType If true will inject the typescript type any
 * @param {boolean} withPrefix
 * @param pathNameChange
 * @returns {string}
 */
exports["default"] = (function (value, withType, withPrefix, pathNameChange) {
    if (withType === void 0) { withType = false; }
    if (pathNameChange === void 0) { pathNameChange = 'path'; }
    if (!value) {
        return '';
    }
    var params = [];
    if (value.parameters) {
        if (value.parameters.some(function (p) { return p["in"] === 'query'; })) {
            params.push('query' + addType(withType, value, 'query'));
        }
        if (value.parameters.some(function (p) { return p["in"] === 'path'; })) {
            params.push(pathNameChange + addType(withType, value, 'path'));
        }
        if (value.parameters.some(function (p) { return p["in"] === 'body'; })) {
            params.push('body' + addType(withType, value, 'body'));
        }
        if (value.parameters.some(function (p) { return p["in"] === 'headers'; })) {
            params.push('headers' + addType(withType, value, 'headers'));
        }
        if (value.parameters.some(function (p) { return p["in"] === 'formData'; })) {
            params.push('files' + addType(withType, value, 'formData'));
        }
    }
    if (value.security) {
        var push_1 = false;
        value.security.forEach(function (security) {
            Object.keys(security).forEach(function (key) {
                if (key.toLowerCase().includes('jwt')) {
                    push_1 = true;
                }
            });
        });
        if (push_1) {
            params.push('jwtData' + addType(withType, value));
        }
    }
    if (value['x-passRequest']) {
        params.push('req' + addType(withType, value));
    }
    params.sort();
    if (withPrefix) {
        params = params.map(function (p) { return (p === 'req') ? 'req' : 'req.' + p; });
    }
    return params.join(', ') + ((withType && params.length > 0) ? ',' : '');
});
