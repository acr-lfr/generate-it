"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (param) => {
    if (param.type) {
        const assign = {};
        assign[param.name] = {
            type: param.type,
        };
        return assign;
    }
    else {
        return param.schema;
    }
};
//# sourceMappingURL=oa2OrOa3.js.map