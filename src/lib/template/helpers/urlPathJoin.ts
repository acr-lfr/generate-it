import * as _ from 'lodash';

export default function (...args: string[]) {
  let returnString = '';
  for (const arg of args) {
    returnString += _.trim(arg, '/');
  }
  return returnString;
}
