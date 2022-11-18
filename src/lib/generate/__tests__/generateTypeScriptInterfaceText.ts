import { ConfigExtendedBase } from '@/interfaces';
import generateTypeScriptInterfaceText from '@/lib/generate/generateTypeScriptInterfaceText';
import { mockConfig } from '@/__mocks__/mockConfig';

describe('generateTypeScriptInterfaceText', () => {
  it('should convert a schema to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText('Person', `
    {
      "type": "object",
      "properties": { "lon": { "type": "number" }, "lat": { "type": "number" } }
    }
    `, mockConfig);
    expect(output.outputString.trim()).toBe(
      'export interface Person {\n' +
      '    lat?: number;\n' +
      '    lon?: number;\n' +
      '}'
    );
  });

  it('should convert a string schema to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText('UserId', `
    {
      "type": "string"
    }
    `, mockConfig);
    expect(output.outputString.trim()).toBe('export type UserId = string;');
  });

  it('should convert an array schema to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText('UserId', `
    {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
    `, mockConfig);
    expect(output.outputString.trim()).toBe('export type UserId = string[];');
  });

  it('should convert an array schema with top level description to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText('NamibianCities', `
    {
      "type": "array",
      "description": "Some weird very long description about Namibian cities",
      "summary": "This is a summary about Namibian Cities",
      "items": {
        "type": "string"
      }
    }
    `, mockConfig);
    expect(output.outputString.trim()).toBe('export type NamibianCities = string[];');
  });

  it('should convert an additionalProperties object schema to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText('UserMap', `
    {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
    `, mockConfig);
    expect(output.outputString.trim()).toBe('export type UserMap = { [key: string]: string };');
  });

  it('should convert an object array schema to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText('Users', `
    {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          }
        }
      }
    }
    `, mockConfig);
    expect(output.outputString.trim()).toBe(
      'export type Users = User[];\n\n' +
      'export interface User {\n' +
      '    name?: string;\n' +
      '}'
    );
  });

  it('should create an enum', async () => {
    const output = await generateTypeScriptInterfaceText('EnumItIs', `
    {
      "type": "string",
      "enum": ["yay", "hey", "it works!"]
    }
    `, mockConfig);

    expect(output.outputString.trim()).toBe(
      'export enum EnumItIs {\n' +
      '    Hey = "hey",\n' +
      '    ItWorks = "it works!",\n' +
      '    Yay = "yay",\n' +
      '}'
    );
  });

  it('should create an union', async () => {
    const unionConfig = {
      ...mockConfig,
      nodegenRc: {
        ...mockConfig.nodegenRc,
        quickTypeOptions: {
          'prefer-unions': 'true'
        }
      }
    };

    const output = await generateTypeScriptInterfaceText('WeAreUnion', `
    {
      "type": "string",
      "enum": ["yay", "hey", "it works!"]
    }
    `, unionConfig);

    expect(output.outputString.trim()).toBe(
      'export type WeAreUnion = "yay" | "hey" | "it works!";'
    );
  });

  it('should work with an external typegen', async () => {
    const mockTypegenConfig = {
      ...mockConfig,
      nodegenRc: {
        ...mockConfig.nodegenRc,
        typegen: './build/__mocks__/mockTypegen.js',
      }
    };

    const name = 'InterfaceName1';
    const schema = 'DummySchema1';
    const output = await generateTypeScriptInterfaceText(name, schema, mockTypegenConfig);

    expect(output.outputString.trim()).toBe(
      `mocked_typegen_${schema}_${name}`
    );
  });
});
