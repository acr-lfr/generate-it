import { LINEBREAK } from '@/constants/cli';
import { ConfigExtendedBase } from '@/interfaces';
import { GenerateTypeScriptInterfaceText } from '@/interfaces/GenerateTypeScriptInterfaceText';
import { JSONSchema } from 'json-schema-ref-parser';

const { InputData, JSONSchemaInput, JSONSchemaStore, quicktype } = require('quicktype/dist/quicktype-core');

const countNoOfMatches = (name: string, line: string): number => {
  const regex = new RegExp(name, 'gi');
  return ((line || '').match(regex) || []).length;
};

const fixNullableProperties = (objectProperties: Record<string, any>): Record<string, any> => {
  return Object.entries(objectProperties).reduce((obj, [key, value]) => ({
    ...obj,
    [key]: value?.type && (value.nullable || value['x-nullable'])
      ? {
        oneOf: [
          { type: value.type },
          { type: 'null' }
        ]
      }
      : value
  }), {});
};

const fixNullableTypes = (definitionObject: JSONSchema, enableNullableWorkaround?: boolean): JSONSchema => {
  if (!enableNullableWorkaround) {
    return definitionObject;
  }

  const unsafeDefinition = definitionObject as any;
  const arrayItems = definitionObject?.items as JSONSchema;

  if (definitionObject?.type === 'array' && arrayItems?.type === 'object' && arrayItems.properties) {
    (definitionObject.items as JSONSchema).properties = fixNullableProperties(arrayItems.properties);
  } else if (definitionObject?.type === 'object' && definitionObject.properties) {
    definitionObject.properties = fixNullableProperties(definitionObject.properties);
  } else if (definitionObject?.type && (unsafeDefinition.nullable || unsafeDefinition['x-nullable'])) {
    const { type, ...definition } = unsafeDefinition;

    return {
      oneOf: [
        { type },
        { type: 'null' }
      ],
      ...definition
    };
  }

  return definitionObject;
};

export default async (name: string, schema: string, config: ConfigExtendedBase): Promise<GenerateTypeScriptInterfaceText> => {
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore());
  await schemaInput.addSource({
    name: '___Nodegen',
    schema: JSON.stringify({
      type: 'object',
      properties: {
        [name]: schema
          ? fixNullableTypes(JSON.parse(schema), config.nodegenRc.enableNullableWorkaround)
          : schema
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
