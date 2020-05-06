"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var ucFirst_1 = tslib_1.__importDefault(require("./ucFirst"));
var oa3toOa2Body_1 = tslib_1.__importDefault(require("../../openapi/oa3toOa2Body"));
function addType(withType, pathObject, requestType, forceType, forceTypeOptional) {
    if (!withType) {
        return '';
    }
    if (!forceType && requestType && pathObject['x-request-definitions'] && pathObject['x-request-definitions'][requestType]) {
        if (requestType === 'body') {
            return ': ' + ucFirst_1["default"](pathObject['x-request-definitions'][requestType].params[0].name);
        }
        return ': ' + pathObject['x-request-definitions'][requestType].name;
    }
    return ': ' + ((forceType) ? forceType + (forceTypeOptional ? ' | undefined' : '') : 'any');
}
/**
 * Provides parameters for controller and domain functions.
 * Will auto inject the req.jwtData if the path has a security attribute.
 * @param method
 * @param pathObject The full value of the path object
 * @param {boolean | object} withType If true will inject the typescript type any
 * @param {boolean} withPrefix
 * @param pathNameChange - Defaults to "pathParams" so as not to collide with the node path lib
 * @returns {string}
 */
function default_1(method, pathObject, withType, withPrefix, pathNameChange) {
    if (withType === void 0) { withType = false; }
    if (pathNameChange === void 0) { pathNameChange = 'pathParams'; }
    if (!pathObject) {
        return '';
    }
    // for OA3 only this is expected where the body cannot be in the parameters
    pathObject = oa3toOa2Body_1["default"](method, pathObject);
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
        if (pathObject.parameters.some(function (p) { return p["in"] === 'header'; })) {
            params.push('headers' + addType(withType, pathObject, 'header'));
        }
        if (pathObject.parameters.some(function (p) { return p["in"] === 'formData'; })) {
            params.push('files' + addType(withType, pathObject, 'formData'));
        }
    }
    var helpers = (this.ctx && this.ctx.config.data.nodegenRc.helpers) ? this.ctx.config.data.nodegenRc.helpers : undefined;
    var fileType = (this.ctx && this.ctx.fileType) ? this.ctx.fileType : undefined;
    var stubHelpers = (helpers && helpers.stub) ? helpers.stub : undefined;
    if (pathObject.security) {
        var push_1 = false;
        pathObject.security = pathObject.security || [];
        pathObject.security.forEach(function (security) {
            Object.keys(security).forEach(function (key) {
                if (key.toLowerCase().includes('jwt')) {
                    push_1 = true;
                }
            });
        });
        if (push_1 || pathObject['x-passThruWithoutJWT']) {
            params.push('jwtData' + addType(withType, pathObject, undefined, (stubHelpers && stubHelpers.jwtType) ? stubHelpers.jwtType : undefined, (!!pathObject['x-passThruWithoutJWT'])));
        }
    }
    if (pathObject['x-passRequest']) {
        if (fileType === 'STUB') {
            params.push('req' + addType(withType, pathObject, undefined, (stubHelpers && stubHelpers.requestType) ? stubHelpers.requestType : undefined));
        }
        else {
            params.push('req' + addType(withType, pathObject));
        }
    }
    params.sort();
    if (withPrefix) {
        params = params.map(function (p) { return (p === 'req') ? 'req' : 'req.' + p; });
    }
    return params.join(', ') + ((withType && params.length > 0) ? ',' : '');
}
exports["default"] = default_1;
