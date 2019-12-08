import path from 'path';
import GeneratedComparison from '@/lib/generate/GeneratedComparison';
import fs from 'fs-extra';
import commandRun from '@/utils/commandRun';

export default async (mainInterfaceName: string, definitionObject: any, targetDir: string) => {
  const baseInterfaceDir = path.join(
    GeneratedComparison.getCacheBaseDir(targetDir),
    'interface',
  );
  fs.ensureDirSync(baseInterfaceDir);
  const tmpJsonSchema = path.join(baseInterfaceDir, mainInterfaceName + '.json');

  // write the json to disk
  fs.writeJsonSync(
    tmpJsonSchema,
    definitionObject,
  );

  // parse to interface
  try {
    return await commandRun('node', [
      path.join('./node_modules/quicktype/dist/cli/index.js'),
      '--just-types',
      '--src',
      tmpJsonSchema,
      '--src-lang',
      'schema',
      '--acronym-style',
      'original',
      '--top-level',
      mainInterfaceName,
      '--lang',
      'ts',
    ]);
  } catch (e) {
    console.error(e);
    throw new Error('quicktype error, full input json used: ' + tmpJsonSchema);
  }
};
