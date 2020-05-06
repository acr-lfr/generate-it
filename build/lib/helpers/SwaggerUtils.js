"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var oa3toOa2Body_1 = tslib_1.__importDefault(require("../openapi/oa3toOa2Body"));
var SwaggerUtils = /** @class */ (function () {
    function SwaggerUtils() {
    }
    /**
     * Converts a sub-section of a definition
     * @param {Object} param
     * @param {Object} [options] - options.isFromArray [string], options.requiredField [string[]]
     * @return {string|void}
     */
    SwaggerUtils.prototype.pathParamsToJoi = function (param, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (!param) {
            console.log(param, options);
            return;
        }
        var validationText = param.name ? param.name + ':' : '';
        var isRequired = (options.requiredFields && options.requiredFields.includes(param.name)) || param.required;
        var type = param.type || param.schema.type;
        if (['string', 'number', 'integer', 'boolean'].includes(type)) {
            if (type === 'integer') {
                validationText += 'Joi.number().integer()';
            }
            else {
                validationText += 'Joi.' + type + '()';
            }
            if (type === 'string' && !isRequired && !param.minLength) {
                validationText += ".allow('')";
            }
            if (param["default"]) {
                if (type === 'string') {
                    validationText += ".default('" + param["default"] + "')";
                }
                else {
                    validationText += ".default(" + param["default"] + ")";
                }
            }
            if (param["enum"] || (param.schema && param.schema["enum"])) {
                var enumValues = param["enum"] || param.schema["enum"];
                validationText += '.valid([' + enumValues.map(function (e) { return "'" + e + "'"; }).join(', ') + '])';
            }
            if (Number(param.minLength)) {
                validationText += ".min(" + +param.minLength + ")";
            }
            if (Number(param.minimum)) {
                validationText += ".min(" + +param.minimum + ")";
            }
            if (Number(param.maxLength)) {
                validationText += ".max(" + +param.maxLength + ")";
            }
            if (Number(param.maximum)) {
                validationText += ".max(" + +param.maximum + ")";
            }
            if (type === 'string' && param.pattern) {
                validationText += (param.pattern ? ".regex(/" + param.pattern + "/)" : '');
            }
            validationText += (isRequired ? '.required()' : '') + (!options.isFromArray ? ',' : '');
        }
        else if (type === 'array') {
            validationText += 'Joi.array().items(';
            validationText += this.pathParamsToJoi(param.schema ? param.schema.items : param.items, {
                isFromArray: true
            });
            validationText += ')';
            if (Number(param.minItems)) {
                validationText += ".min(" + +param.minItems + ")";
            }
            if (Number(param.maxItems)) {
                validationText += ".max(" + +param.maxItems + ")";
            }
            validationText += (isRequired ? '.required(),' : ',');
        }
        else if (param.properties || param.schema) {
            var properties_1 = param.properties || param.schema.properties || {};
            validationText += 'Joi.object({';
            Object.keys(properties_1).forEach(function (propertyKey) {
                validationText += _this.pathParamsToJoi(tslib_1.__assign({ name: propertyKey }, properties_1[propertyKey]));
            });
            validationText += '})' + (isRequired ? '.required()' : '') + (!options.isFromArray ? ',' : '');
        }
        else {
            validationText += 'Joi.any()' + (isRequired ? '.required()' : '') + (!options.isFromArray ? ',' : '');
        }
        return validationText;
    };
    /**
     * Iterates over the request params from an OpenAPI path and returns Joi validation syntax for a validation class.
     * @param method
     * @param {Object} pathObject
     * @return {string|void}
     */
    SwaggerUtils.prototype.createJoiValidation = function (method, pathObject) {
        var _this = this;
        pathObject = oa3toOa2Body_1["default"](method, pathObject);
        var requestParams = pathObject.parameters;
        if (!requestParams) {
            return;
        }
        var paramsTypes = {
            body: requestParams.filter(function (param) { return param["in"] === 'body'; }),
            params: requestParams.filter(function (param) { return param["in"] === 'path'; }),
            query: requestParams.filter(function (param) { return param["in"] === 'query'; })
        };
        for (var key in paramsTypes.params) {
            if (paramsTypes.params[key].schema) {
                paramsTypes.params[key].type = paramsTypes.params[key].schema.type;
            }
        }
        for (var key in paramsTypes.query) {
            if (paramsTypes.query[key].schema) {
                paramsTypes.query[key].type = paramsTypes.query[key].schema.type;
            }
        }
        var validationText = '';
        Object.keys(paramsTypes).forEach(function (paramTypeKey) {
            if (paramsTypes[paramTypeKey].length === 0) {
                return;
            }
            validationText += paramTypeKey + ': {';
            paramsTypes[paramTypeKey].forEach(function (param) {
                if (param.schema && param.schema.properties) {
                    Object.keys(param.schema.properties).forEach(function (propertyKey) {
                        validationText += _this.pathParamsToJoi(tslib_1.__assign({ name: propertyKey }, param.schema.properties[propertyKey]), {
                            requiredFields: param.schema.required
                        });
                    });
                }
                else if (param.type || (param.schema && param.schema.type)) {
                    validationText += _this.pathParamsToJoi(param);
                }
            });
            validationText += '},';
        });
        return validationText;
    };
    return SwaggerUtils;
}());
exports["default"] = new SwaggerUtils();
