"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (value) => {
    const headers = Object.keys(value).filter((key) => key.startsWith('jwtToken')).map((key) => {
        return `req.headers[${value[key].name.toLowerCase()}]`;
    });
    return (headers.length === 0) ? 'false' : headers.join(' || ');
};
