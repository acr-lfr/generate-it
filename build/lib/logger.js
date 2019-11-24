"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (o) => {
    if (typeof o === 'object') {
        console.log(JSON.stringify(o, undefined, 2));
    }
    else {
        console.log(o);
    }
};
//# sourceMappingURL=logger.js.map