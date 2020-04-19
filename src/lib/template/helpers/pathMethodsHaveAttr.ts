import { Operation, Operations } from '@/interfaces/Operations';
import isValidMethod from '@/lib/template/helpers/isValidMethod';

export default (operations: Operations, attr: string): boolean => {
  let found = false;
  // console.log(JSON.stringify(operations, null, 2));
  operations.forEach((op: Operation) => {
    for (const method in op.path) {
      if (isValidMethod(method)) {
        if (op.path[method][attr]) {
          found = true;
        }
      }
    }
  });
  return found;
};
