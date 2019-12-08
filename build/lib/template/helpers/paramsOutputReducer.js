"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var extractOASchemaPathResponses_1 = tslib_1.__importDefault(require("../../helpers/extractOASchemaPathResponses"));
var OaToJs_1 = tslib_1.__importDefault(require("../../helpers/OaToJs"));
var OaToJsToJs_1 = tslib_1.__importDefault(require("../../helpers/OaToJsToJs"));
exports["default"] = (function (responses) {
    var schema = extractOASchemaPathResponses_1["default"](JSON.parse(JSON.stringify(responses)));
    var a = OaToJs_1["default"].oaToJsType(schema);
    if (a && a.required) {
        delete a.required;
    }
    if (Array.isArray(a)) {
        return '[' + OaToJsToJs_1["default"].arrayWalkWrite(a) + '],';
    }
    else {
        return OaToJsToJs_1["default"].objectWalkWrite(a);
    }
});
