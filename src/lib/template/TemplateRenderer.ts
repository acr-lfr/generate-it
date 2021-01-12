import { TemplateVariables } from '@/interfaces/TemplateVariables';
import prettyfyRenderedContent from '@/lib/helpers/prettyfyRenderedContent';
import arrayContains from '@/lib/template/helpers/arrayContains';
import consoleLog from '@/lib/template/helpers/consoleLog';
import endsWith from '@/lib/template/helpers/endsWith';
import getContext from '@/lib/template/helpers/getContext';
import getSecurityNames from '@/lib/template/helpers/getSecurityNames';
import getSingleSuccessResponse from '@/lib/template/helpers/getSingleSuccessResponse';
import importInterfaces from '@/lib/template/helpers/importInterfaces';
import inline from '@/lib/template/helpers/inline';
import isObjLength from '@/lib/template/helpers/isObjLength';
import isUsingJwt from '@/lib/template/helpers/isUsingJwt';
import isUsingSecurityDefinition from '@/lib/template/helpers/isUsingSecurityDefinition';
import isValidMethod from '@/lib/template/helpers/isValidMethod';
import lcFirst from '@/lib/template/helpers/lcFirst';
import mockOutput from '@/lib/template/helpers/mockOutput';
import objLength from '@/lib/template/helpers/objLength';
import operationsPathsHasParamsToValidate from '@/lib/template/helpers/operationsPathsHasParamsToValidate';
import paramsOutputReducer from '@/lib/template/helpers/paramsOutputReducer';
import paramsValidation from '@/lib/template/helpers/paramsValidation';
import pathMethodsHaveAttr from '@/lib/template/helpers/pathMethodsHaveAttr';
import pathParamsToDomainParams from '@/lib/template/helpers/pathParamsToDomainParams';
import pathsHasParamsToValidate from '@/lib/template/helpers/pathsHasParamsToValidate';
import prettifyRouteName from '@/lib/template/helpers/prettifyRouteName';
import ucFirst from '@/lib/template/helpers/ucFirst';
import urlPathJoin from '@/lib/template/helpers/urlPathJoin';
import validMethods from '@/lib/template/helpers/validMethods';
import fs from 'fs-extra';
import _ from 'lodash';
import nunjucks from 'nunjucks';
import * as path from 'path';

export class TemplateRenderer {
  public env: nunjucks.Environment;
  public helpersRegistered: boolean = false;

  /**
   * Loads and renders a tpl
   * @param {string} inputString The string to parse
   * @param {object} customVars Custom variables passed to nunjucks
   * @param {string} ext - the file type by extension
   * @param {object} additionalHelpers
   * @param configRcFile Fully qualified path to .openapi-nodegenrc file   *
   * @return {*}
   */
  public load (inputString: string, customVars?: TemplateVariables, ext?: string) {
    this.nunjucksSetup(customVars);
    try {

      const content = this.stripCharacters(nunjucks.renderString(inputString, customVars));
      return ext ? prettyfyRenderedContent(content, ext) : content;
    } catch (e) {
      console.trace(e);
    }
  }

  /**
   *
   * @param content
   */
  public stripCharacters (content: string) {
    return content.replace(new RegExp('&' + '#' + 'x27;', 'g'), "'");
  }

  /**
   * Sets up the tpl engine for the current file being rendered
   * @param {object} helperFunctionKeyValueObject
   * @param configRcFile Exact path to a .boatsrc file
   */
  public nunjucksSetup (variables?: TemplateVariables) {
    if (this.env) {
      this.registerHelpers(variables?.config?.templates_dir);
      return;
    }

    this.env = nunjucks.configure(this.nunjucksOptions());

    const processEnvVars = JSON.parse(JSON.stringify(process.env));
    for (const key in processEnvVars) {
      if (processEnvVars.hasOwnProperty(key)) {
        this.env.addGlobal(key, processEnvVars[key]);
      }
    }

    this.env.addGlobal('arrayContains', arrayContains);
    this.env.addGlobal('consoleLog', consoleLog);
    this.env.addGlobal('endsWith', endsWith);
    this.env.addGlobal('getSingleSuccessResponse', getSingleSuccessResponse);
    this.env.addGlobal('getContext', getContext);
    this.env.addGlobal('getSecurityNames', getSecurityNames);
    this.env.addGlobal('importInterfaces', importInterfaces);
    this.env.addGlobal('inline', inline);
    this.env.addGlobal('isObjLength', isObjLength);
    this.env.addGlobal('isUsingJwt', isUsingJwt);
    this.env.addGlobal('isUsingSecurityDefinition', isUsingSecurityDefinition);
    this.env.addGlobal('isValidMethod', isValidMethod);
    this.env.addGlobal('lcFirst', lcFirst);
    this.env.addGlobal('mockOutput', mockOutput);
    this.env.addGlobal('objLength', objLength);
    this.env.addGlobal('paramsOutputReducer', paramsOutputReducer);
    this.env.addGlobal('paramsValidation', paramsValidation);
    this.env.addGlobal('operationsPathsHasParamsToValidate', operationsPathsHasParamsToValidate);
    this.env.addGlobal('paramsValidation', paramsValidation);
    this.env.addGlobal('pathsHasParamsToValidate', pathsHasParamsToValidate);
    this.env.addGlobal('pathMethodsHaveAttr', pathMethodsHaveAttr);
    this.env.addGlobal('pathParamsToDomainParams', pathParamsToDomainParams);
    this.env.addGlobal('prettifyRouteName', prettifyRouteName);
    this.env.addGlobal('ucFirst', ucFirst);
    this.env.addGlobal('urlPathJoin', urlPathJoin);
    this.env.addGlobal('validMethods', validMethods);

    this.env.addGlobal('_', _);

    this.registerHelpers(variables?.config?.templates_dir);
  }

  public registerHelpers (tplDir: string): void {
    if (!tplDir || !this.env || this.helpersRegistered) {
      return;
    }

    const helperDir = path.join(tplDir, '.openapi-nodegen/helpers');
    try {
      if (!fs.lstatSync(helperDir).isDirectory()) {
        this.helpersRegistered = true;
        return;
      }
    } catch (e) {
      this.helpersRegistered = true;
      return;
    }

    fs.readdirSync(helperDir).forEach((filename) => {
      if (filename.endsWith('.js')) {
        const resolved = require(path.join(helperDir, filename)).default;
        this.env.addGlobal(filename.replace(/.js$/, ''), resolved);
      }
    });

    this.helpersRegistered = true;
  }

  /**
   * Tries to inject the provided json from a .boatsrc file
   * @param configRcFile
   * @returns {{autoescape: boolean, tags: {blockStart: string, commentStart: string, variableEnd: string,
   * variableStart: string, commentEnd: string, blockEnd: string}}|({autoescape: boolean,
   * tags: {blockStart: string, commentStart: string, variableEnd: string, variableStart: string,
   * commentEnd: string, blockEnd: string}} & Template.nunjucksOptions)}
   */
  public nunjucksOptions (configRcFile = '') {
    const baseOptions = {
      autoescape: false,
    };
    try {
      const json = fs.readJsonSync(configRcFile);
      if (json.nunjucksOptions) {
        return Object.assign(baseOptions, json.nunjucksOptions);
      }
    } catch (e) {
      return baseOptions;
    }
  }
}

export default new TemplateRenderer();
