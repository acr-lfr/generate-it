"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const nunjucks_1 = tslib_1.__importDefault(require("nunjucks"));
class TemplateRenderer {
    /**
     * Loads and renders a tpl
     * @param {string} inputString The string to parse
     * @param {object} customVars Custom variables passed to nunjucks
     * @param {object} additionalHelpers
     * @param configRcFile Fully qualified path to .openapi-nodegenrc file   *
     * @return {*}
     */
    load(inputString, customVars = {}, additionalHelpers = {}, configRcFile = '') {
        this.nunjucksSetup(Object.assign(require('./helpers/template/index'), additionalHelpers), configRcFile);
        return nunjucks_1.default.renderString(inputString, customVars);
    }
    /**
     * Sets up the tpl engine for the current file being rendered
     * @param {object} helperFunctionKeyValueObject
     * @param configRcFile Exact path to a .boatsrc file
     */
    nunjucksSetup(helperFunctionKeyValueObject = {}, configRcFile = '') {
        const env = nunjucks_1.default.configure(this.nunjucksOptions(configRcFile));
        const processEnvVars = JSON.parse(JSON.stringify(process.env));
        for (const key in processEnvVars) {
            if (processEnvVars.hasOwnProperty(key)) {
                env.addGlobal(key, processEnvVars[key]);
            }
        }
        Object.keys(helperFunctionKeyValueObject).forEach((key) => {
            env.addGlobal(key, helperFunctionKeyValueObject[key]);
        });
    }
    /**
     * Tries to inject the provided json from a .boatsrc file
     * @param configRcFile
     * @returns {{autoescape: boolean, tags: {blockStart: string, commentStart: string, variableEnd: string,
     * variableStart: string, commentEnd: string, blockEnd: string}}|({autoescape: boolean,
     * tags: {blockStart: string, commentStart: string, variableEnd: string, variableStart: string,
     * commentEnd: string, blockEnd: string}} & Template.nunjucksOptions)}
     */
    nunjucksOptions(configRcFile = '') {
        const baseOptions = {
            autoescape: false,
        };
        try {
            const json = fs_extra_1.default.readJsonSync(configRcFile);
            if (json.nunjucksOptions) {
                return Object.assign(baseOptions, json.nunjucksOptions);
            }
        }
        catch (e) {
            return baseOptions;
        }
    }
}
exports.default = new TemplateRenderer();
