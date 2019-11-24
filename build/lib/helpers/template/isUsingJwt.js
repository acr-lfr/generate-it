"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (value) => {
    return (Object.keys(value.security[0])[0].startsWith('jwtToken'));
};
