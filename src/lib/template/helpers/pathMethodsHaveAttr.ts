import * as _ from 'lodash';
import { Operation, Path } from '@/interfaces';
import isValidMethod from '@/lib/template/helpers/isValidMethod';

type Methods = 'get' |'put' |'post' |'delete' |'options' |'head' |'patch';

export default (operations: Operation[], attr: string, nestedPath?: string): boolean => {
  let found = false;
  for (const key in operations) {
    const op: Operation = operations[key];
    for (const method in op.path) {
      if (isValidMethod(method)) {
        if (op.path[method as Methods][attr as keyof Operation]) {
          if (!nestedPath) {
            found = true;
          } else {
            const nestedParts = nestedPath.split('.');
            let objectToLookIn = op.path[method as Methods][attr as keyof Operation];
            nestedParts.forEach((part) => {
              if (objectToLookIn) {
                if (Array.isArray(objectToLookIn)) {
                  objectToLookIn = objectToLookIn.find(item => {
                    return item[part] !== undefined;
                  });
                  if (objectToLookIn) {
                    objectToLookIn = objectToLookIn[part];
                  }
                } else {
                  objectToLookIn = _.get(objectToLookIn, part);
                }
              }
            });
            if (objectToLookIn !== undefined) {
              found = true;
            }
          }
        }
      }
    }
  }
  return found;
};
