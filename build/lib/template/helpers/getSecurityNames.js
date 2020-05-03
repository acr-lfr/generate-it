"use strict";
exports.__esModule = true;
/**
 * Extracts the security key names from a path object and returns as a tpl string or array
 * @param pathObject
 * @param fullSwaggerObject
 */
exports["default"] = (function (pathObject, fullSwaggerObject) {
    if (!pathObject || !pathObject.security || pathObject.security.length === 0 || !fullSwaggerObject.securityDefinitions) {
        return '';
    }
    /**
     * Example input "security": [{"apiKeyAdmin": []},{"jwtToken": []}],
     */
    var names = [];
    pathObject.security.forEach(function (secObj) {
        Object.keys(secObj).forEach(function (name) {
            if (fullSwaggerObject.securityDefinitions[name]) {
                var headerName = fullSwaggerObject.securityDefinitions[name].name;
                names.push("'" + headerName + "'");
            }
        });
    });
    return (names.length === 0) ? '' : '[' + names.join(', ') + ']';
});
