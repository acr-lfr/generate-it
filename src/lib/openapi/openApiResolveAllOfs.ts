import * as _ from 'lodash';

type SpecObject = { [key: string]: any };
type CustomizerFunction = (objValue: any, srcValue: any) => any;

function resolveAllOf (inputSpec: SpecObject): SpecObject {
  if (inputSpec && typeof inputSpec === 'object' && Object.keys(inputSpec).length > 0) {
    if (inputSpec.allOf) {
      const allOf = inputSpec.allOf as SpecObject[];
      delete inputSpec.allOf;

      const merged = allOf.reduce((acc: SpecObject, item: SpecObject) => {
        const resolvedItem = resolveAllOf(item);
        if (resolvedItem.required) {
          acc.required = _.union(acc.required || [], resolvedItem.required);
        }
        return _.mergeWith(acc, resolvedItem, customizer);
      }, {});

      inputSpec = _.defaultsDeep(inputSpec, merged);
    }

    Object.keys(inputSpec).forEach((key: string) => {
      inputSpec[key] = resolveAllOf(inputSpec[key]);
    });
  }
  return inputSpec;
}

const customizer: CustomizerFunction = (objValue: any, srcValue: any) => {
  if (_.isArray(objValue)) {
    return _.union(objValue, srcValue);
  }
};

export default (input: SpecObject): SpecObject => {
  return resolveAllOf(input);
};
