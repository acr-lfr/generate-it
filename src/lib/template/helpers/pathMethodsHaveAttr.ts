import * as _ from 'lodash';
import { Operation, Operations } from '@/interfaces/Operations';
import isValidMethod from '@/lib/template/helpers/isValidMethod';

export default (operations: Operations, attr: string, nestedPath?: string): boolean => {
  let found = false;
  for (let key in operations) {
    const op: Operation = operations[key];
    for (const method in op.path) {
      if (isValidMethod(method)) {
        if (op.path[method][attr]) {
          if (!nestedPath) {
            found = true;
          } else {
            const nestedParts = nestedPath.split('.');
            let objectToLookIn = op.path[method][attr];
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
