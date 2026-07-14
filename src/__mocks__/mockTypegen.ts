import { ConfigExtendedBase, TypegenFunction } from '@/interfaces';

const mockTypegen: TypegenFunction = async (
  name: string,
  schema: string,
  _config: ConfigExtendedBase
) => {
  return {
    outputString: `mocked_typegen_${schema}_${name}`
  };
};


export default mockTypegen;
