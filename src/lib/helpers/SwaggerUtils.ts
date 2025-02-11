import oa3toOa2Body from '@/lib/openapi/oa3toOa2Body';
import { NodegenRc } from '@/interfaces';

enum ParamTypeKey {
  body = 'body',
  headers = 'headers',
  params = 'params',
  query = 'query',
}

interface PathParamsToJoi {
  requiredFields?: string[];
  isFromArray?: boolean;
  paramTypeKey: ParamTypeKey;
}

class SwaggerUtils {
  /**
   * Prepare the regex string based on how it has been formed in the openapi file pattern
   * @param inputPattern
   */
  prepareRegexPattern (inputPattern: string): string {
    if (inputPattern[0] !== '/') {
      inputPattern = '/' + inputPattern;
    }
    if (inputPattern[inputPattern.length - 1] !== '/') {
      const regex = new RegExp(/\/[gmusi]{1,}$/); // js regex options
      if (!regex.test(inputPattern)) {
        // no regex options found, but also no trailing slash, append 1 now
        inputPattern += '/';
      }
    }
    return inputPattern;
  }

  /**
   * Converts a sub-section of a definition
   */
  public pathParamsToJoi (param: any, options: PathParamsToJoi, nodegenRc?: NodegenRc): string {
    if (!param) {
      console.log(param, options);
      return;
    }

    const {paramTypeKey} = options;
    let validationText = param.name ? `'${param.name}'` + ':' : '';
    const isRequired = (options.requiredFields && options.requiredFields.includes(param.name)) || param.required === true;
    const type = param.type || param.schema.type;

    const nullable = paramTypeKey === ParamTypeKey.body && (!isRequired || param['x-nullable'] || param.nullable) ? '.allow(null)' : '';
    const validationTrailer = (isRequired && !options.isFromArray ? `${nullable}.required()` : nullable) + (!options.isFromArray ? ',' : '');

    if (['string', 'number', 'integer', 'boolean'].includes(type)) {
      if (type === 'integer') {
        validationText += 'Joi.number().integer()';
      } else {
        validationText += 'Joi.' + type + '()';
      }

      // extract the potential Joi methods, pass the value to the method
      const paramKeys = Object.keys(param);
      paramKeys.forEach((key) => {
        // https://joi.dev/api/?v=17.9.1
        if (key.startsWith('x-joi-')) {
          const joiStringMethod = key.replace('x-joi-', '');
          let joiParam = param[key] !== null ? param[key] : '';
          if (typeof joiParam === 'object') {
            joiParam = JSON.stringify(joiParam);
          }
          validationText += `.${joiStringMethod}(${joiParam})`;
        }
      });

      if (type === 'string') {
        if (nodegenRc?.joi?.strings?.autoTrim === 'opt-out' && !param['x-dont-trim']) {
          validationText += `.trim(true)`;
        }

        if ((!isRequired || nullable) && !param.minLength) {
          validationText += `.allow('')`;
        }
      }

      if (param.default !== undefined) {
        if (type === 'string') {
          validationText += `.default('${param.default}')`;
        } else {
          validationText += `.default(${param.default})`;
        }
      }

      if (param.enum || (param.schema && param.schema.enum)) {
        const enumValues = param.enum || param.schema.enum;
        const validTplString = enumValues.map((e: string) => ['number', 'integer'].includes(type) ? e : `'${e}'`).join(', ');
        validationText += '.valid(' + validTplString + ')';
      }

      if (!Number.isNaN(Number(param.minLength))) {
        validationText += `.min(${+param.minLength})`;
      }
      if (!Number.isNaN(Number(param.minimum))) {
        validationText += `.min(${+param.minimum})`;
      }
      if (!Number.isNaN(Number(param.maxLength))) {
        validationText += `.max(${+param.maxLength})`;
      }
      if (!Number.isNaN(Number(param.maximum))) {
        validationText += `.max(${+param.maximum})`;
      }
      if (type === 'string' && param.pattern) {
        validationText += param.pattern ? `.regex(${this.prepareRegexPattern(param.pattern)})` : '';
      }
      validationText += validationTrailer;
    } else if (type === 'array') {
      validationText += 'Joi.array()';
      const itemsContent = this.pathParamsToJoi(
        param.schema ? param.schema.items : param.items,
        {
          isFromArray: true,
          paramTypeKey
        },
        nodegenRc
      );
      if (itemsContent) {
        validationText += `.items(${itemsContent})`;
      }

      if (options.paramTypeKey && options.paramTypeKey === 'query') {
        validationText += '.single()';
      }

      if (!Number.isNaN(Number(param.minItems))) {
        validationText += `.min(${+param.minItems})`;
      }
      if (!Number.isNaN(Number(param.maxItems))) {
        validationText += `.max(${+param.maxItems})`;
      }
      validationText += isRequired && !options.isFromArray ? '.required(),' : ',';
    } else if (param.properties || param.schema) {
      const properties = param.properties || param.schema.properties || {};
      validationText += 'Joi.object({';
      Object.keys(properties).forEach((propertyKey) => {
        validationText += this.pathParamsToJoi(
          {
            name: propertyKey,
            ...properties[propertyKey],
          },
          {
            requiredFields: Array.isArray(param.required) ? param.required : undefined,
            paramTypeKey,
          },
          nodegenRc
        );
      });
      validationText += '})' + validationTrailer;
    } else {
      validationText += 'Joi.any()' + validationTrailer;
    }
    return validationText;
  }

  /**
   * Iterates over the request params from an OpenAPI path and returns Joi validation syntax for a validation class.
   */
  public createJoiValidation (method: string, pathObject: any, nodegenRc?: NodegenRc): string {
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
        for (const attr in paramsTypes.headers[key].schema) {
          paramsTypes.headers[key][attr] = paramsTypes.headers[key].schema[attr];
        }
      }
    }
    for (const key in paramsTypes.params) {
      if (paramsTypes.params[key].schema) {
        for (const attr in paramsTypes.params[key].schema) {
          paramsTypes.params[key][attr] = paramsTypes.params[key].schema[attr];
        }
      }
    }
    for (const key in paramsTypes.query) {
      if (paramsTypes.query[key].schema) {
        for (const attr in paramsTypes.query[key].schema) {
          paramsTypes.query[key][attr] = paramsTypes.query[key].schema[attr];
        }
      }
    }

    let validationText = '';

    Object.keys(paramsTypes).forEach((paramTypeKey) => {
      if (paramsTypes[paramTypeKey].length === 0) {
        return;
      }
      validationText += `'${paramTypeKey}': Joi.object({`;
      paramsTypes[paramTypeKey].forEach((param: any) => {

        if (param.schema && param.schema.type === 'object' && !param.schema.properties) {
          // An object without properties = any = no validation
          validationText = validationText.replace(
            `'${paramTypeKey}': Joi.object({`,
            `'${paramTypeKey}': Joi.any({`
          );
        } else if (param.schema && param.schema.properties) {
          if (paramTypeKey === 'query') {
            validationText += `'${param.name}': Joi.object({`;
          }
          Object.keys(param.schema.properties).forEach((propertyKey) => {
            validationText += this.pathParamsToJoi(
              {
                name: propertyKey,
                ...param.schema.properties[propertyKey],
              },
              {
                requiredFields: param.schema.required,
                paramTypeKey: paramTypeKey as ParamTypeKey,
              },
              nodegenRc
            );
          });
          if (paramTypeKey === 'query') {
            validationText += '}),';
          }
        } else if (param.type || (param.schema && param.schema.type)) {
          validationText += this.pathParamsToJoi(
            param, {
              paramTypeKey: paramTypeKey as ParamTypeKey,
            },
            nodegenRc
          );
        }
      });
      validationText += '})';

      // due to string concat pattern in this function replace needed for the joi any
      validationText = validationText.replace('Joi.any({})', 'Joi.any()');

      // Add unknown to the header validation
      if (paramTypeKey === ParamTypeKey.headers) {
        validationText += '.unknown(true)';
      }
      validationText += ',';
    });

    return validationText;
  }
}

export default new SwaggerUtils();
