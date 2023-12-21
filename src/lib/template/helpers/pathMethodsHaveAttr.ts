import * as _ from 'lodash';
import { Operation } from '@/interfaces';
import isValidMethod from '@/lib/template/helpers/isValidMethod';

type Methods = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch';

export default (operations: Operation[], attr: string, nestedPaths?: string | string[]): boolean => {
  const nestedPathsToFind: string[] = Array.isArray(nestedPaths) ? nestedPaths : [nestedPaths];
  let found = false;
  for (const key in operations) {
    const op: Operation = operations[key];
    for (const method in op.path) {
      if (isValidMethod(method)) {
        if (op.path[method as Methods][attr as keyof Operation]) {
          if (!nestedPaths) {
            found = true;
          } else {
            nestedPathsToFind.forEach((nestedPath) => {
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
            });
          }
        }
      }
    }
  }
  return found;
};
