"use strict";
exports.__esModule = true;
var ApiIs = /** @class */ (function () {
    function ApiIs() {
    }
    ApiIs.prototype.swagger = function (apiObject) {
        return !!(apiObject.swagger && apiObject.swagger[0] === '2'
            || apiObject.openapi && apiObject.openapi[0] === '2');
    };
    ApiIs.prototype.openapi2 = function (apiObject) {
        return this.swagger(apiObject);
    };
    ApiIs.prototype.openapi3 = function (apiObject) {
        return !!(apiObject.openapi && apiObject.openapi[0] === '3');
    };
    ApiIs.prototype.asyncapi2 = function (apiObject) {
        return !!(apiObject.asyncapi && apiObject.asyncapi[0] === '2');
    };
    return ApiIs;
}());
exports["default"] = new ApiIs();
