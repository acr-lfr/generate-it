"use strict";
exports.__esModule = true;
/**
 * Extracts the security key names from a path object and returns as a tpl string or array
 * @param pathObject
 * @param fullSwaggerObject
 */
exports["default"] = (function (pathObject, fullSwaggerObject) {
    if (!pathObject || !pathObject.security || pathObject.security.length === 0) {
        return '';
    }
    if (!fullSwaggerObject.securityDefinitions &&
        !(fullSwaggerObject.components &&
            fullSwaggerObject.components.securitySchemes)) {
        return '';
    }
    var securityDefinitions = fullSwaggerObject.securityDefinitions ||
        fullSwaggerObject.components.securitySchemes;
    /**
     * Example input "security": [{"apiKeyAdmin": []},{"jwtToken": []}],
     */
    var names = [];
    pathObject.security.forEach(function (secObj) {
        Object.keys(secObj).forEach(function (name) {
            if (securityDefinitions[name]) {
                var headerName = ['bearer', 'oauth2'].includes(securityDefinitions[name].scheme || securityDefinitions[name].type)
                    ? 'Authorization'
                    : securityDefinitions[name].name;
                names.push("'" + headerName + "'");
            }
        });
    });
    return names.length === 0 ? '' : '[' + names.join(', ') + ']';
});
