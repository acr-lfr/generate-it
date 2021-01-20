import { mergePackageJsonFiles } from '../mergePackageJsonFiles';

it('merge user scripts and tpl scripts block without overwriting users stuffs', async () => {

  const users = {
    'name': 'ms-thingy-bob',
    'version': '1245.23.2',
    'description': 'this does thingys',
    'scripts': {
      'generate': 'npm run generate:server && npm run generate:rabbitmq',
      'generate:server': 'generate-it ../ms_3pie_d/build/ms_3pie_d_1.0.1.yml -y -t https://github.com/acrontum/openapi-nodegen-typescript-server.git',
      'generate:rabbitmq': 'generate-it ../ms_rabbitmq_d/build/rabbitmq_asyncapi_1.0.1.yml -y -t https://github.com/acrontum/generate-it-asyncapi-rabbitmq-fanout.git -o src/events',
      'build': 'ttsc -p .',
    }
  };

  const tpls = {
    'name': 'tpl-stuff',
    'version': '1245.23.2',
    'description': 'this is a tpl',
    'scripts': {
      'build': 'nope do not want this',
      'cli-script': 'VERBOSE=true && node ./build/server.js -r ',
      'dev:setup': 'git config core.hooksPath githooks && cp -n .env.example .env',
      'lint': 'eslint \'src/**/*.{js,ts,tsx}\'',
      'lint:fix': 'eslint \'src/**/*.{js,ts,tsx}\' --quiet --fix',
    }
  };

  const other = {
    and: {
      this: {
        is: 'other'
      }
    }
  };

  const predictedMerge = {
    'name': 'ms-thingy-bob',
    'version': '1245.23.2',
    'description': 'this does thingys',
    'scripts': {
      'generate': 'npm run generate:server && npm run generate:rabbitmq',
      'generate:server': 'generate-it ../ms_3pie_d/build/ms_3pie_d_1.0.1.yml -y -t https://github.com/acrontum/openapi-nodegen-typescript-server.git',
      'generate:rabbitmq': 'generate-it ../ms_rabbitmq_d/build/rabbitmq_asyncapi_1.0.1.yml -y -t https://github.com/acrontum/generate-it-asyncapi-rabbitmq-fanout.git -o src/events',
      'build': 'ttsc -p .',
      'cli-script': 'VERBOSE=true && node ./build/server.js -r ',
      'dev:setup': 'git config core.hooksPath githooks && cp -n .env.example .env',
      'lint': 'eslint \'src/**/*.{js,ts,tsx}\'',
      'lint:fix': 'eslint \'src/**/*.{js,ts,tsx}\' --quiet --fix',
    },
    and: {
      this: {
        is: 'other'
      }
    }
  };

  const merged = mergePackageJsonFiles(users, tpls, other);

  expect(merged).toEqual(predictedMerge);
});
