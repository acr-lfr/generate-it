"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const extractOASchemaPathResponses_1 = tslib_1.__importDefault(require("../extractOASchemaPathResponses"));
const dummyGenerate = (schema) => {
    return schema ? 'return mockItGenerator(' + JSON.stringify(schema) + ')' : undefined;
};
exports.default = (path, mockServer) => {
    if (mockServer) {
        return (path && path.responses) ?
            dummyGenerate(extractOASchemaPathResponses_1.default(path.responses)) :
            undefined;
    }
    else {
        return 'return {}';
    }
};
