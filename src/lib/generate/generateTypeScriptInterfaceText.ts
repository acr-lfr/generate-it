import { LINEBREAK } from '@/constants/cli';
import GenerateTypeScriptInterfaceText from '@/interfaces/GenerateTypeScriptInterfaceText';

const {InputData, JSONSchemaInput, JSONSchemaStore, quicktype} = require('quicktype/dist/quicktype-core');

export default async (name: string, schema: string): Promise<GenerateTypeScriptInterfaceText> => {
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore());
  await schemaInput.addSource({
    name,
    schema: schema,
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
  interfaceContent.lines.forEach((line: string) => {
    interfaceReturnString += line + LINEBREAK;
  });
  return {
    outputString: interfaceReturnString,
  };
};
