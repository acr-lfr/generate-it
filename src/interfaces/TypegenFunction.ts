import { ConfigExtendedBase } from '@/interfaces/ConfigExtendedBase';
import { GenerateTypeScriptInterfaceText } from '@/interfaces/GenerateTypeScriptInterfaceText';

export type TypegenFunction = (
  name: string,
  schema: string,
  config: ConfigExtendedBase
) => Promise<GenerateTypeScriptInterfaceText>;
