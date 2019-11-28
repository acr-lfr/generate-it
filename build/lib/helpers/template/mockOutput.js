"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var extractOASchemaPathResponses_1 = tslib_1.__importDefault(require("../extractOASchemaPathResponses"));
var dummyGenerate = function (schema) {
    return schema ? 'return mockItGenerator(' + JSON.stringify(schema) + ')' : undefined;
};
exports["default"] = (function (path, mockServer) {
    if (mockServer) {
        return (path && path.responses) ?
            dummyGenerate(extractOASchemaPathResponses_1["default"](path.responses)) :
            undefined;
    }
    else {
        return 'return {}';
    }
});
