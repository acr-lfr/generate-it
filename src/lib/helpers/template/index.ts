import fs from 'fs-extra';
import * as _ from 'lodash';
import path from 'path';

const files = fs.readdirSync(__dirname);
const object: any = {};
files.forEach((file) => {
  if (!file.includes('__tests__') && !files.includes('index.ts')) {
    object[path.basename(file, '.ts')] = require(path.join(__dirname, file));
  }
});

for (const key in _) {
  if (_.hasOwnProperty(key)) {
    // @ts-ignore
    object[key] = _[key];
  }
}

export default object;
