"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const oa2OrOa3_1 = tslib_1.__importDefault(require("../oa2OrOa3"));
const OaToJs_1 = tslib_1.__importDefault(require("../OaToJs"));
const OaToJsToJs_1 = tslib_1.__importDefault(require("../OaToJsToJs"));
exports.default = (parameters) => {
    let body = {};
    let query = {};
    let params = {};
    if (parameters) {
        parameters = JSON.parse(JSON.stringify(parameters));
        parameters.forEach((param) => {
            if (param.in === 'body') {
                body = Object.assign(body, param.schema.properties);
            }
            if (param.in === 'query') {
                query = Object.assign(query, oa2OrOa3_1.default(param));
            }
            if (param.in === 'path') {
                params = Object.assign(params, oa2OrOa3_1.default(param));
            }
        });
        OaToJs_1.default.objectWalk(body);
        OaToJs_1.default.objectWalk(query);
        OaToJs_1.default.objectWalk(params);
        return OaToJsToJs_1.default.objectWalkWrite({
            body, query, params,
        });
    }
    return `{
    body: {},
    query: {},
    params: {},
  },
`;
};
