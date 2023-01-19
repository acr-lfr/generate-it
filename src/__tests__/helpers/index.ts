import fs from 'fs-extra';
import path from 'path';

export const tplUrl = 'https://github.com/acrontum/openapi-nodegen-typescript-server.git';
export const tplClientServer = 'https://github.com/acrontum/openapi-nodegen-typescript-server-client.git';
export const clearTestServer = (dir: string = 'test_server') => {
  // return;
  const names = fs.readdirSync(path.join(process.cwd(), dir));
  for (let i = 0; i < names.length; ++i) {
    if (names[i] === '.openapi-nodegen') {
      // only remove the merged folder from .openapi-nodegen dirs
      const fullOpenapiNodeGenPath = path.join(process.cwd(), dir, names[i], 'git/httpsGithubComAcrontumOpenapiNodegenTypescriptServerGit_merged');
      if (fs.pathExistsSync(fullOpenapiNodeGenPath)) {
        fs.removeSync(fullOpenapiNodeGenPath);
      }
    } else {
      fs.removeSync(path.join(process.cwd(), dir, names[i]));
    }
  }
  const compare = path.join(process.cwd(), dir, '/.openapi-nodegen/cache');
  if (fs.pathExistsSync(compare)) {
    fs.removeSync(compare);
  }
};

export * from './yaml-to-json';
