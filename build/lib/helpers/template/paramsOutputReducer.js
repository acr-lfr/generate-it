"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const extractOASchemaPathResponses_1 = tslib_1.__importDefault(require("../extractOASchemaPathResponses"));
const OaToJs_1 = tslib_1.__importDefault(require("../OaToJs"));
const OaToJsToJs_1 = tslib_1.__importDefault(require("../OaToJsToJs"));
exports.default = (responses) => {
    const schema = extractOASchemaPathResponses_1.default(JSON.parse(JSON.stringify(responses)));
    const a = OaToJs_1.default.oaToJsType(schema);
    if (a && a.required) {
        delete a.required;
    }
    if (Array.isArray(a)) {
        return '[' + OaToJsToJs_1.default.arrayWalkWrite(a) + '],';
    }
    else {
        return OaToJsToJs_1.default.objectWalkWrite(a);
    }
};
//# sourceMappingURL=paramsOutputReducer.js.map