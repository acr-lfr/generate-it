import { join, basename } from 'path';
import { promises as fs } from 'fs';
import { safeLoad } from 'js-yaml';

type JSON = { [key: string]: any };

/**
 * Parse a YAML file into nested JSON
 */
export const yamlToJson = async (yamlFilePath: string): Promise<JSON> => {
  if (!yamlFilePath) {
    throw new Error('No file path given');
  }

  const exists = await fs
    .access(yamlFilePath)
    .then(() => true)
    .catch(() => false);
  if (!exists) {
    throw new Error(`Could not find YAML file '${yamlFilePath}'`);
  }

  return safeLoad(await fs.readFile(yamlFilePath, 'utf8')) as JSON;
};

/**
 * Parse a YAML file into a newline-delimited block of expects (usually
 * for outputting to stdout)
 */
export const yamlToExpect = async (yamlFilePath: string): Promise<string> => {
  const json = await yamlToJson(yamlFilePath);
  const formatted = flatten(json);

  const expects = Object.entries(formatted).reduce(
    (expectLines: string[], [key, value]) => expectLines.concat(`expect(itemToTest.${key}).toBe(${value});`),
    []
  );

  return expects.join('\n');
};

/**
 * Format object properties
 * eg:
 *   prop is "variable like"
 *   => test.variableLike.something
 *   prop is numeric
 *   => test[200].something
 *   otherwise
 *   => test['thing-with/non-variable or numeric'].something
 */
export const fmtProp = (prop: any) => {
  if (/^[a-zA-Z\$][a-zA-Z\$0-9_]*$/.test(prop)) {
    return `.${prop}`;
  }
  if (/^[0-9]+$/.test(prop)) {
    return `[${prop}]`;
  }
  return `['${prop}']`;
};

/**
 * Deal with quoting
 * Check if the value does not contain a particular string type ['"`] and
 * use that, or use escaped value
 *   'thing', "thing's thing", `"A quote 'n stuff"`
 */
export const fmtString = (value: any) => {
  if (typeof value === 'string') {
    let quote;
    if (!/'/.test(value)) {
      quote = "'";
    } else if (!/"/.test(value)) {
      quote = '"';
    } else if (!/`/.test(value)) {
      quote = '`';
    } else {
      quote = "'";
      value = value.replace(/'/g, "\\'");
    }
    value = `${quote}${value}${quote}`;
  }
  return value;
};

/**
 * Turn nested json into flattened accessors
 * https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
 *
 * eg:
 *   {
 *     thing: {
 *       one: 'two'
 *     },
 *     arr: [{ one: 1 }, { two: 2 }]
 *   }
 *
 * becomes:
 *   {
 *     'thing.one' : 'two',
 *     'arr[0].one': 1,
 *     'arr[1].two': 2
 *   }
 */
export const flatten = (data: JSON) => {
  const result: JSON = {};

  const recurse = (cur: JSON, prop: string) => {
    if (Object(cur) !== cur) {
      result[prop] = fmtString(cur);
    } else if (Array.isArray(cur)) {
      let l = cur.length;
      for (let i = 0; i < l; i++) {
        recurse(cur[i], prop ? prop + fmtProp(i) : '' + i);
        l = cur.length;
      }
      if (l === 0) {
        result[prop] = [];
      }
    } else {
      let isEmpty = true;
      for (const p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + fmtProp(p) : p);
      }
      if (isEmpty) {
        result[prop] = {};
      }
    }
  };
  recurse(data, '');

  return result;
};

/**
 * Accept command-line arguments
 *
 * node build/src/__tests__/helpers/yaml-to-json.js path/to/test.yml
 */
export const cli = (): Promise<void> => {
  const input = process.argv[2];
  if (!input) {
    console.error(`usage: ${basename(process.argv[1])} inputYaml`);
    process.exit(1);
  }

  const fullInPath = join(process.cwd(), input || '');

  return yamlToExpect(fullInPath)
    .then((lines) => {
      console.log(lines);
      process.exit(0);
    })
    .catch((err) => {
      console.trace(err);
      process.exit(1);
    });
};

if (require.main === module) {
  cli();
}
