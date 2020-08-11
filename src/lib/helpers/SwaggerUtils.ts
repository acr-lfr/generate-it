import oa3toOa2Body from '@/lib/openapi/oa3toOa2Body';

class SwaggerUtils {
  /**
   * Converts a sub-section of a definition
   * @param {Object} param
   * @param {Object} [options] - options.isFromArray [string], options.requiredField [string[]]
   * @return {string|void}
   */
  public pathParamsToJoi (param: any, options: any = {}) {
    if (!param) {
      console.log(param, options);
      return;
    }
    let validationText = param.name ? `'${param.name}'` + ':' : '';
    const isRequired = (options.requiredFields && options.requiredFields.includes(param.name)) || param.required;
    const type = param.type || param.schema.type;
    if (['string', 'number', 'integer', 'boolean'].includes(type)) {
      if (type === 'integer') {
        validationText += 'Joi.number().integer()';
      } else {
        validationText += 'Joi.' + type + '()';
      }

      if (type === 'string' && !isRequired && !param.minLength) {
        validationText += `.allow('')`;
      }
      if (param.default) {
        if (type === 'string') {
          validationText += `.default('${param.default}')`;
        } else {
          validationText += `.default(${param.default})`;
        }
      }
      if (param.enum || (param.schema && param.schema.enum)) {
        const enumValues = param.enum || param.schema.enum;
        validationText += '.valid(' + enumValues.map((e: string) => `'${e}'`).join(', ') + ')';
      }

      if (Number(param.minLength)) {
        validationText += `.min(${+param.minLength})`;
      }
      if (Number(param.minimum)) {
        validationText += `.min(${+param.minimum})`;
      }
      if (Number(param.maxLength)) {
        validationText += `.max(${+param.maxLength})`;
      }
      if (Number(param.maximum)) {
        validationText += `.max(${+param.maximum})`;
      }
      if (type === 'string' && param.pattern) {
        validationText += (param.pattern ? `.regex(/${param.pattern}/)` : '');
      }
      validationText += (isRequired && !options.isFromArray ? '.required()' : '') + (!options.isFromArray ? ',' : '');
    } else if (type === 'array') {
      validationText += 'Joi.array().items(';
      validationText += this.pathParamsToJoi(param.schema ? param.schema.items : param.items, {
        isFromArray: true,
      });
      validationText += ')';

      if (options.paramTypeKey && options.paramTypeKey === 'query') {
        validationText += '.single()';
      }

      if (Number(param.minItems)) {
        validationText += `.min(${+param.minItems})`;
      }
      if (Number(param.maxItems)) {
        validationText += `.max(${+param.maxItems})`;
      }
      validationText += (isRequired && !options.isFromArray ? '.required(),' : ',');
    } else if (param.properties || param.schema) {
      const properties = param.properties || param.schema.properties || {};
      validationText += 'Joi.object({';
      Object.keys(properties).forEach((propertyKey) => {
        validationText += this.pathParamsToJoi({
          name: propertyKey, ...properties[propertyKey],
        });
      });
      validationText += '})' + (isRequired && !options.isFromArray ? '.required()' : '') + (!options.isFromArray ? ',' : '');
    } else {
      validationText += 'Joi.any()' + (isRequired && !options.isFromArray ? '.required()' : '') + (!options.isFromArray ? ',' : '');
    }
    return validationText;
  }

  /**
   * Iterates over the request params from an OpenAPI path and returns Joi validation syntax for a validation class.
   * @param method
   * @param {Object} pathObject
   * @return {string|void}
   */
  public createJoiValidation (method: string, pathObject: any) {
    pathObject = oa3toOa2Body(method, pathObject);
    const requestParams = pathObject.parameters;
    if (!requestParams) {
      return;
    }
    const paramsTypes: any = {
      body: requestParams.filter((param: any) => param.in === 'body'),
      headers: requestParams.filter((param: any) => param.in === 'header'),
      params: requestParams.filter((param: any) => param.in === 'path'),
      query: requestParams.filter((param: any) => param.in === 'query'),
    };
    for (const key in paramsTypes.headers) {
      if (paramsTypes.headers[key].schema) {
        paramsTypes.headers[key].type = paramsTypes.headers[key].schema.type;
      }
    }
    for (const key in paramsTypes.params) {
      if (paramsTypes.params[key].schema) {
        paramsTypes.params[key].type = paramsTypes.params[key].schema.type;
      }
    }
    for (const key in paramsTypes.query) {
      if (paramsTypes.query[key].schema) {
        paramsTypes.query[key].type = paramsTypes.query[key].schema.type;
      }
    }

    let validationText = '';

    Object.keys(paramsTypes).forEach((paramTypeKey) => {
      if (paramsTypes[paramTypeKey].length === 0) {
        return;
      }
      validationText += `'${paramTypeKey}': {`;
      paramsTypes[paramTypeKey].forEach((param: any) => {
        if (param.schema && param.schema.properties) {
          Object.keys(param.schema.properties).forEach((propertyKey) => {
            validationText += this.pathParamsToJoi({
              name: propertyKey, ...param.schema.properties[propertyKey],
            }, {
              requiredFields: param.schema.required,
              paramTypeKey,
            });
          });
        } else if (param.type || (param.schema && param.schema.type)) {
          validationText += this.pathParamsToJoi(param, { paramTypeKey });
        }
      });
      validationText += '},';
    });

    return validationText;
  }
}

export default new SwaggerUtils();
