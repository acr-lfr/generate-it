import fs from 'fs-extra';
import path from 'path';

export const templates = {
  tsServerGit: 'https://github.com/acrontum/openapi-nodegen-typescript-server.git',
  serverClientGit:'https://github.com/acrontum/openapi-nodegen-typescript-server-client.git',
  asyncapiRabbitmqGit: 'https://github.com/acrontum/generate-it-asyncapi-rabbitmq.git',
};

export const clearTestServer = (dir: string = 'test_server') => {
  // return;
  const names = fs.readdirSync(path.join(process.cwd(), dir));
  for (let i = 0; i < names.length; ++i) {
    if (names[i] !== '.openapi-nodegen') {
      fs.removeSync(path.join(process.cwd(), dir, names[i]));
    }
  }
  const compare = path.join(process.cwd(), dir, '/.openapi-nodegen/cache');
  if (fs.pathExistsSync(compare)) {
    fs.removeSync(compare);
  }
};

export * from './yaml-to-json';
