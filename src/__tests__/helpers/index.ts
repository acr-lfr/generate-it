import fs from 'fs-extra';
import path from 'path';

export const templates = {
  tsServerGit: 'https://github.com/acrontum/openapi-nodegen-typescript-server.git',
  serverClientGit: 'https://github.com/acrontum/openapi-nodegen-typescript-server-client.git',
  asyncapiRabbitmqGit: 'https://github.com/acrontum/generate-it-asyncapi-rabbitmq.git',
};

export const clearTestServer = (dir: string = 'test_server') => {
  const root = path.join(process.cwd(), dir);
  if (!fs.existsSync(root)) {
    return;
  }

  const names = fs.readdirSync(root);
  for (let i = 0; i < names.length; ++i) {
    if (names[i] !== '.openapi-nodegen') {
      fs.removeSync(path.join(root, names[i]));
    }
  }
  const compare = path.join(root, '/.openapi-nodegen/cache');
  if (fs.pathExistsSync(compare)) {
    fs.removeSync(compare);
  }
};

export * from './yaml-to-json';
