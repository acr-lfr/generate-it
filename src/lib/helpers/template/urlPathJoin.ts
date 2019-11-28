import * as _ from 'lodash';

export default function () {
  let returnString = '';
  for (const arg in arguments) {
    if (arguments.hasOwnProperty(arg)) {
      returnString += _.trim(arguments[arg], '/');
    }
  }
  return returnString;
}
