"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var oa2OrOa3_1 = tslib_1.__importDefault(require("../oa2OrOa3"));
var OaToJs_1 = tslib_1.__importDefault(require("../OaToJs"));
var OaToJsToJs_1 = tslib_1.__importDefault(require("../OaToJsToJs"));
exports["default"] = (function (parameters) {
    var body = {};
    var query = {};
    var params = {};
    if (parameters) {
        parameters = JSON.parse(JSON.stringify(parameters));
        parameters.forEach(function (param) {
            if (param["in"] === 'body') {
                body = Object.assign(body, param.schema.properties);
            }
            if (param["in"] === 'query') {
                query = Object.assign(query, oa2OrOa3_1["default"](param));
            }
            if (param["in"] === 'path') {
                params = Object.assign(params, oa2OrOa3_1["default"](param));
            }
        });
        OaToJs_1["default"].objectWalk(body);
        OaToJs_1["default"].objectWalk(query);
        OaToJs_1["default"].objectWalk(params);
        return OaToJsToJs_1["default"].objectWalkWrite({
            body: body, query: query, params: params
        });
    }
    return "{\n    body: {},\n    query: {},\n    params: {},\n  },\n";
});
