"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (value, swagger) => {
    if (!value || !value.security || value.security.length === 0) {
        return '';
    }
    // just grab the 1st element of the security and use that
    const secDefName = Object.keys(value.security[0])[0];
    const secDef = swagger.securityDefinitions[secDefName];
    if (secDefName.startsWith('jwtToken')) {
        return `jwtMiddleware('${secDef.name}'),`;
    }
    else if (secDefName.startsWith('apiKey')) {
        return `apiKeyMiddleware('${secDef.name}'),`;
    }
    return '';
};
//# sourceMappingURL=getSecDefMiddleware.js.map