import fs from 'fs-extra';
import nunjucks from 'nunjucks';
import _ from 'lodash';
import arrayContains from '@/lib/helpers/template/arrayContains';
import celebrateImport from '@/lib/helpers/template/celebrateImport';
import celebrateRoute from '@/lib/helpers/template/celebrateRoute';
import endsWith from '@/lib/helpers/template/endsWith';
import getApiKeyHeaders from '@/lib/helpers/template/getApiKeyHeaders';
import getSecurityNames from '@/lib/helpers/template/getSecurityNames';
import importInterfaces from '@/lib/helpers/template/importInterfaces';
import inline from '@/lib/helpers/template/inline';
import isObjLength from '@/lib/helpers/template/isObjLength';
import isUsingJwt from '@/lib/helpers/template/isUsingJwt';
import isUsingSecurityDefinition from '@/lib/helpers/template/isUsingSecurityDefinition';
import isValidMethod from '@/lib/helpers/template/isValidMethod';
import lcFirst from '@/lib/helpers/template/lcFirst';
import mockOutput from '@/lib/helpers/template/mockOutput';
import objLength from '@/lib/helpers/template/objLength';
import paramsInputReducer from '@/lib/helpers/template/paramsInputReducer';
import paramsOutputReducer from '@/lib/helpers/template/paramsOutputReducer';
import paramsValidation from '@/lib/helpers/template/paramsValidation';
import pathParamsToDomainParams from '@/lib/helpers/template/pathParamsToDomainParams';
import prettifyRouteName from '@/lib/helpers/template/prettifyRouteName';
import ucFirst from '@/lib/helpers/template/ucFirst';
import urlPathJoin from '@/lib/helpers/template/urlPathJoin';
import validMethods from '@/lib/helpers/template/validMethods';

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
      // tags: {
      //   blockStart: '<%',
      //   blockEnd: '%>',
      //   variableStart: '<$',
      //   variableEnd: '$>',
      //   commentStart: '<#',
      //   commentEnd: '#>'
      // }
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
