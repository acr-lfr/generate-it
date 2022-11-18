import { LINEBREAK } from '@/constants/cli';
import { ConfigExtendedBase, TypegenFunction } from '@/interfaces';
import { GenerateTypeScriptInterfaceText } from '@/interfaces/GenerateTypeScriptInterfaceText';

const { InputData, JSONSchemaInput, JSONSchemaStore, quicktype } = require('quicktype/dist/quicktype-core');

const countNoOfMatches = (name: string, line: string): number => {
  const regex = new RegExp(name, 'gi');
  return ((line || '').match(regex) || []).length;
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

    return typegen(name, schema, config);
  }

  const schemaInput = new JSONSchemaInput(new JSONSchemaStore());
  await schemaInput.addSource({
    name: '___Nodegen',
    schema: JSON.stringify({
      type: 'object',
      properties: {
        [name]: schema ? JSON.parse(schema) : schema,
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
