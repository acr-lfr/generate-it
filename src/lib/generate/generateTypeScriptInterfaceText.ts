import { LINEBREAK } from '@/constants/cli';
import GenerateTypeScriptInterfaceText from '@/interfaces/GenerateTypeScriptInterfaceText';

const { InputData, JSONSchemaInput, JSONSchemaStore, quicktype } = require('quicktype/dist/quicktype-core');




const countNoOfMatches = (name: string, line: string): number => {
  const regex = new RegExp(name, 'gi');
  return ((line || '').match(regex) || []).length;
};

export default async (name: string, schema: string): Promise<GenerateTypeScriptInterfaceText> => {
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore());
  await schemaInput.addSource({
    name: 'Nodegen',
    schema: JSON.stringify({
      type: 'object',
      properties: {
        [name]: schema ? JSON.parse(schema) : schema
      }
    }),
  });

  const inputData = new InputData();
  inputData.addInput(schemaInput);

  const interfaceContent = await quicktype({
    inputData,
    lang: 'ts',
    rendererOptions: {
      'just-types': true,
      'acronym-style': 'original',
    },
  });

  let interfaceReturnString = '';
  interfaceContent.lines.forEach((line: string, i: number) => {
    if (i === 0 || i === 2) {
      return;
    }
    if (i === 1) {
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