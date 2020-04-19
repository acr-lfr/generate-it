"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var nunjucks_1 = tslib_1.__importDefault(require("nunjucks"));
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var arrayContains_1 = tslib_1.__importDefault(require("./helpers/arrayContains"));
var endsWith_1 = tslib_1.__importDefault(require("./helpers/endsWith"));
var getChannelOperationIds_1 = tslib_1.__importDefault(require("./helpers/getChannelOperationIds"));
var getContext_1 = tslib_1.__importDefault(require("./helpers/getContext"));
var getSecurityNames_1 = tslib_1.__importDefault(require("./helpers/getSecurityNames"));
var importInterfaces_1 = tslib_1.__importDefault(require("./helpers/importInterfaces"));
var inline_1 = tslib_1.__importDefault(require("./helpers/inline"));
var isObjLength_1 = tslib_1.__importDefault(require("./helpers/isObjLength"));
var isUsingJwt_1 = tslib_1.__importDefault(require("./helpers/isUsingJwt"));
var isUsingSecurityDefinition_1 = tslib_1.__importDefault(require("./helpers/isUsingSecurityDefinition"));
var isValidMethod_1 = tslib_1.__importDefault(require("./helpers/isValidMethod"));
var lcFirst_1 = tslib_1.__importDefault(require("./helpers/lcFirst"));
var mockOutput_1 = tslib_1.__importDefault(require("./helpers/mockOutput"));
var objLength_1 = tslib_1.__importDefault(require("./helpers/objLength"));
var paramsOutputReducer_1 = tslib_1.__importDefault(require("./helpers/paramsOutputReducer"));
var paramsValidation_1 = tslib_1.__importDefault(require("./helpers/paramsValidation"));
var pathParamsToDomainParams_1 = tslib_1.__importDefault(require("./helpers/pathParamsToDomainParams"));
var pathsHasParamsToValidate_1 = tslib_1.__importDefault(require("./helpers/pathsHasParamsToValidate"));
var pathMethodsHaveAttr_1 = tslib_1.__importDefault(require("./helpers/pathMethodsHaveAttr"));
var prettifyRouteName_1 = tslib_1.__importDefault(require("./helpers/prettifyRouteName"));
var prettyfyRenderedContent_1 = tslib_1.__importDefault(require("../../utils/prettyfyRenderedContent"));
var operationsPathsHasParamsToValidate_1 = tslib_1.__importDefault(require("./helpers/operationsPathsHasParamsToValidate"));
var ucFirst_1 = tslib_1.__importDefault(require("./helpers/ucFirst"));
var urlPathJoin_1 = tslib_1.__importDefault(require("./helpers/urlPathJoin"));
var validMethods_1 = tslib_1.__importDefault(require("./helpers/validMethods"));
var TemplateRenderer = /** @class */ (function () {
    function TemplateRenderer() {
    }
    /**
     * Loads and renders a tpl
     * @param {string} inputString The string to parse
     * @param {object} customVars Custom variables passed to nunjucks
     * @param {string} ext - the file type by extension
     * @param {object} additionalHelpers
     * @param configRcFile Fully qualified path to .openapi-nodegenrc file   *
     * @return {*}
     */
    TemplateRenderer.prototype.load = function (inputString, customVars, ext, additionalHelpers, configRcFile) {
        if (customVars === void 0) { customVars = {}; }
        if (additionalHelpers === void 0) { additionalHelpers = {}; }
        if (configRcFile === void 0) { configRcFile = ''; }
        this.nunjucksSetup(additionalHelpers, configRcFile);
        var content = this.stripCharacters(nunjucks_1["default"].renderString(inputString, customVars));
        return ext ? prettyfyRenderedContent_1["default"](content, ext) : content;
    };
    /**
     *
     * @param content
     */
    TemplateRenderer.prototype.stripCharacters = function (content) {
        return content.replace(new RegExp('&' + '#' + 'x27;', 'g'), '\'');
    };
    /**
     * Sets up the tpl engine for the current file being rendered
     * @param {object} helperFunctionKeyValueObject
     * @param configRcFile Exact path to a .boatsrc file
     */
    TemplateRenderer.prototype.nunjucksSetup = function (helperFunctionKeyValueObject, configRcFile) {
        if (helperFunctionKeyValueObject === void 0) { helperFunctionKeyValueObject = {}; }
        if (configRcFile === void 0) { configRcFile = ''; }
        var env = nunjucks_1["default"].configure(this.nunjucksOptions(configRcFile));
        var processEnvVars = JSON.parse(JSON.stringify(process.env));
        for (var key in processEnvVars) {
            if (processEnvVars.hasOwnProperty(key)) {
                env.addGlobal(key, processEnvVars[key]);
            }
        }
        env.addGlobal('arrayContains', arrayContains_1["default"]);
        env.addGlobal('endsWith', endsWith_1["default"]);
        env.addGlobal('getChannelPublishOperationIds', getChannelOperationIds_1["default"]);
        env.addGlobal('getContext', getContext_1["default"]);
        env.addGlobal('getSecurityNames', getSecurityNames_1["default"]);
        env.addGlobal('importInterfaces', importInterfaces_1["default"]);
        env.addGlobal('inline', inline_1["default"]);
        env.addGlobal('isObjLength', isObjLength_1["default"]);
        env.addGlobal('isUsingJwt', isUsingJwt_1["default"]);
        env.addGlobal('isUsingSecurityDefinition', isUsingSecurityDefinition_1["default"]);
        env.addGlobal('isValidMethod', isValidMethod_1["default"]);
        env.addGlobal('lcFirst', lcFirst_1["default"]);
        env.addGlobal('mockOutput', mockOutput_1["default"]);
        env.addGlobal('objLength', objLength_1["default"]);
        env.addGlobal('paramsOutputReducer', paramsOutputReducer_1["default"]);
        env.addGlobal('paramsValidation', paramsValidation_1["default"]);
        env.addGlobal('operationsPathsHasParamsToValidate', operationsPathsHasParamsToValidate_1["default"]);
        env.addGlobal('paramsValidation', paramsValidation_1["default"]);
        env.addGlobal('pathsHasParamsToValidate', pathsHasParamsToValidate_1["default"]);
        env.addGlobal('pathMethodsHaveAttr', pathMethodsHaveAttr_1["default"]);
        env.addGlobal('pathParamsToDomainParams', pathParamsToDomainParams_1["default"]);
        env.addGlobal('prettifyRouteName', prettifyRouteName_1["default"]);
        env.addGlobal('ucFirst', ucFirst_1["default"]);
        env.addGlobal('urlPathJoin', urlPathJoin_1["default"]);
        env.addGlobal('validMethods', validMethods_1["default"]);
        env.addGlobal('_', lodash_1["default"]);
        Object.keys(helperFunctionKeyValueObject).forEach(function (key) {
            env.addGlobal(key, helperFunctionKeyValueObject[key]);
        });
    };
    /**
     * Tries to inject the provided json from a .boatsrc file
     * @param configRcFile
     * @returns {{autoescape: boolean, tags: {blockStart: string, commentStart: string, variableEnd: string,
     * variableStart: string, commentEnd: string, blockEnd: string}}|({autoescape: boolean,
     * tags: {blockStart: string, commentStart: string, variableEnd: string, variableStart: string,
     * commentEnd: string, blockEnd: string}} & Template.nunjucksOptions)}
     */
    TemplateRenderer.prototype.nunjucksOptions = function (configRcFile) {
        if (configRcFile === void 0) { configRcFile = ''; }
        var baseOptions = {
            autoescape: false
        };
        try {
            var json = fs_extra_1["default"].readJsonSync(configRcFile);
            if (json.nunjucksOptions) {
                return Object.assign(baseOptions, json.nunjucksOptions);
            }
        }
        catch (e) {
            return baseOptions;
        }
    };
    return TemplateRenderer;
}());
exports["default"] = new TemplateRenderer();
