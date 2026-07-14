import { LINEBREAK } from '@/constants/cli';
import { ConfigExtendedBase, TypegenFunction } from '@/interfaces';
import { GenerateTypeScriptInterfaceText } from '@/interfaces/GenerateTypeScriptInterfaceText';
import _ from 'lodash';

import { InputData, JSONSchemaInput, quicktype } from 'quicktype-core';

const countNoOfMatches = (name: string, line: string): number => {
  const regex = new RegExp(name, 'gi');
  return ((line || '').match(regex) || []).length;
};

// quicktype-core >= 23 renders "[property: string]: any;" index signatures for
// object schemas that do not set additionalProperties. quicktype 15 could not
// render them, so default open objects to closed to keep generated interfaces
// stable; an explicit additionalProperties in the spec is left untouched.
const closeOpenObjects = (node: any): any => {
  if (Array.isArray(node)) {
    node.forEach(closeOpenObjects);
    return node;
  }
  if (!node || typeof node !== 'object') {
    return node;
  }
  if ((node.type === 'object' || node.properties) && node.additionalProperties === undefined && node.patternProperties === undefined) {
    node.additionalProperties = false;
  }
  Object.keys(node).forEach((key) => {
    if (!['enum', 'const', 'default', 'example', 'examples'].includes(key)) {
      closeOpenObjects(node[key]);
    }
  });
  return node;
};

const generateTypeScriptInterfaceText: TypegenFunction = async (
  name: string,
  schema: string,
  config: ConfigExtendedBase
): Promise<GenerateTypeScriptInterfaceText> => {
  if (config.nodegenRc.typegen) {
    const typegenModule = require(
      config.nodegenRc.typegen.startsWith('./')
        ? config.nodegenRc.typegen.replace(/^\.\//, `${process.cwd()}/`)
        : config.nodegenRc.typegen
    );

    const typegen: TypegenFunction = typeof typegenModule.default === 'function'
      ? typegenModule.default
      : typegenModule;

    return typegen(
      name,
      schema,
      _.cloneDeep(config)
    );
  }

  const schemaInput = new JSONSchemaInput(undefined);
  await schemaInput.addSource({
    name: '___Nodegen',
    schema: JSON.stringify({
      type: 'object',
      additionalProperties: false,
      properties: {
        [name]: schema ? closeOpenObjects(JSON.parse(schema)) : schema,
      },
    }),
  });

  const inputData = new InputData();
  inputData.addInput(schemaInput);

  const interfaceContent = await quicktype({
    inputData,
    lang: 'ts',
    rendererOptions: {
      ...(config.nodegenRc?.quickTypeOptions || {}),
      'just-types': true,
      'acronym-style': 'original',
    },
  });

  let interfaceReturnString = '';
  const skipUntil = interfaceContent.lines.findIndex((line: string) => line && line.includes(name + '?:'));
  interfaceContent.lines.forEach((line: string, i: number) => {
    if (i < skipUntil || i === skipUntil + 1) {
      return;
    }
    if (i === skipUntil) {
      if (countNoOfMatches(name, line) === 2) {
        return;
      }
      line = 'export type ' + name + line.trim().replace(name + '?:', ' =');
    }
    interfaceReturnString += line + LINEBREAK;
  });
  return {
    outputString: interfaceReturnString,
  };
};

export default generateTypeScriptInterfaceText;
