import generateTypeScriptInterfaceText from '@/lib/generate/generateTypeScriptInterfaceText';

describe('generateTypeScriptInterfaceText', () => {
  it('should convert a schema to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText(
      'Person',
      `
    {
      "type": "object",
      "properties": { "lon": { "type": "number" }, "lat": { "type": "number" } }
    }
    `
    );
    expect(output.outputString.trim()).toBe(
      'export interface Person {\n' + '    lat?: number;\n' + '    lon?: number;\n' + '}'
    );
  });

  it('should convert a string schema to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText(
      'UserId',
      `
    {
      "type": "string"
    }
    `
    );
    expect(output.outputString.trim()).toBe('export type UserId = string;');
  });

  it('should convert an array schema to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText(
      'UserId',
      `
    {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
    `
    );
    expect(output.outputString.trim()).toBe('export type UserId = string[];');
  });

  it('should convert an array schema with top level description to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText(
      'NamibianCities',
      `
    {
      "type": "array",
      "description": "Some weird very long description about Namibian cities",
      "summary": "This is a summary about Namibian Cities",
      "items": {
        "type": "string"
      }
    }
    `
    );
    expect(output.outputString.trim()).toBe('export type NamibianCities = string[];');
  });

  it('should convert an additionalProperties object schema to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText(
      'UserMap',
      `
    {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
    `
    );
    expect(output.outputString.trim()).toBe('export type UserMap = { [key: string]: string };');
  });

  it('should convert an object array schema to the correct type', async () => {
    const output = await generateTypeScriptInterfaceText(
      'Users',
      `
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
    `
    );
    expect(output.outputString.trim()).toBe(
      'export type Users = User[];\n\n' + 'export interface User {\n' + '    name?: string;\n' + '}'
    );
  });
});
