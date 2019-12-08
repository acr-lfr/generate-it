import fs from 'fs-extra';
import nunjucks from 'nunjucks';
import _ from 'lodash';
import arrayContains from '@/lib/template/helpers/arrayContains';
import celebrateImport from '@/lib/template/helpers/celebrateImport';
import celebrateRoute from '@/lib/template/helpers/celebrateRoute';
import endsWith from '@/lib/template/helpers/endsWith';
import getApiKeyHeaders from '@/lib/template/helpers/getApiKeyHeaders';
import getSecurityNames from '@/lib/template/helpers/getSecurityNames';
import importInterfaces from '@/lib/template/helpers/importInterfaces';
import inline from '@/lib/template/helpers/inline';
import isObjLength from '@/lib/template/helpers/isObjLength';
import isUsingJwt from '@/lib/template/helpers/isUsingJwt';
import isUsingSecurityDefinition from '@/lib/template/helpers/isUsingSecurityDefinition';
import isValidMethod from '@/lib/template/helpers/isValidMethod';
import lcFirst from '@/lib/template/helpers/lcFirst';
import mockOutput from '@/lib/template/helpers/mockOutput';
import objLength from '@/lib/template/helpers/objLength';
import paramsInputReducer from '@/lib/template/helpers/paramsInputReducer';
import paramsOutputReducer from '@/lib/template/helpers/paramsOutputReducer';
import paramsValidation from '@/lib/template/helpers/paramsValidation';
import pathParamsToDomainParams from '@/lib/template/helpers/pathParamsToDomainParams';
import prettifyRouteName from '@/lib/template/helpers/prettifyRouteName';
import ucFirst from '@/lib/template/helpers/ucFirst';
import urlPathJoin from '@/lib/template/helpers/urlPathJoin';
import validMethods from '@/lib/template/helpers/validMethods';

class TemplateRenderer {
  /**
   * Loads and renders a tpl
   * @param {string} inputString The string to parse
   * @param {object} customVars Custom variables passed to nunjucks
   * @param {object} additionalHelpers
   * @param configRcFile Fully qualified path to .openapi-nodegenrc file   *
   * @return {*}
   */
  public load (inputString: string, customVars = {}, additionalHelpers = {}, configRcFile = '') {
    this.nunjucksSetup(additionalHelpers, configRcFile);
    return nunjucks.renderString(inputString, customVars);
  }

  /**
   * Sets up the tpl engine for the current file being rendered
   * @param {object} helperFunctionKeyValueObject
   * @param configRcFile Exact path to a .boatsrc file
   */
  public nunjucksSetup (helperFunctionKeyValueObject: any = {}, configRcFile = '') {
    const env = nunjucks.configure(this.nunjucksOptions(configRcFile));

    const processEnvVars = JSON.parse(JSON.stringify(process.env));
    for (const key in processEnvVars) {
      if (processEnvVars.hasOwnProperty(key)) {
        env.addGlobal(key, processEnvVars[key]);
      }
    }

    env.addGlobal('arrayContains', arrayContains);
    env.addGlobal('celebrateImport', celebrateImport);
    env.addGlobal('celebrateRoute', celebrateRoute);
    env.addGlobal('endsWith', endsWith);
    env.addGlobal('getApiKeyHeaders', getApiKeyHeaders);
    env.addGlobal('getSecurityNames', getSecurityNames);
    env.addGlobal('importInterfaces', importInterfaces);
    env.addGlobal('inline', inline);
    env.addGlobal('isObjLength', isObjLength);
    env.addGlobal('isUsingJwt', isUsingJwt);
    env.addGlobal('isUsingSecurityDefinition', isUsingSecurityDefinition);
    env.addGlobal('isValidMethod', isValidMethod);
    env.addGlobal('lcFirst', lcFirst);
    env.addGlobal('mockOutput', mockOutput);
    env.addGlobal('objLength', objLength);
    env.addGlobal('paramsInputReducer', paramsInputReducer);
    env.addGlobal('paramsOutputReducer', paramsOutputReducer);
    env.addGlobal('paramsValidation', paramsValidation);
    env.addGlobal('pathParamsToDomainParams', pathParamsToDomainParams);
    env.addGlobal('prettifyRouteName', prettifyRouteName);
    env.addGlobal('ucFirst', ucFirst);
    env.addGlobal('urlPathJoin', urlPathJoin);
    env.addGlobal('validMethods', validMethods);

    env.addGlobal('_', _);

    Object.keys(helperFunctionKeyValueObject).forEach((key: string) => {
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
