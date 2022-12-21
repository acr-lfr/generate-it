import fs from 'fs-extra';
import path from 'path';
import openapiNodegen from '@/generateIt';

jest.setTimeout(60 * 1000); // in milliseconds

const testServerName = 'test_server_233';
const testServerPath = path.join(process.cwd(), testServerName);

describe('e2e testing', () => {
  beforeAll(() => {
    fs.removeSync(testServerPath);
  });
  afterAll(() => {
    fs.removeSync(testServerPath);
  });

  it('Should build from https then update ie git pull over https', (done) => {
    const ymlPath = path.join(process.cwd(), 'test_swagger.yml');
    const openapiConfig = {
      dontRunComparisonTool: false,
      dontUpdateTplCache: false,
      updateDependenciesFromTpl: false,
      mockServer: false,
      swaggerFilePath: ymlPath,
      targetDir: testServerPath,
      template: 'https://github.com/acr-lfr/generate-it-typescript-server-client.git',
    };
    openapiNodegen(openapiConfig)
      .then(() => {
        openapiNodegen(openapiConfig)
          .then(() => done())
          .catch((e) => done(e));
      })
      .catch(e => done(e));
  });

  it('Should build from SSH then update ie git pull over SSH', (done) => {
    const ymlPath = path.join(process.cwd(), 'test_swagger.yml');
    const openapiConfig = {
      dontRunComparisonTool: false,
      dontUpdateTplCache: false,
      updateDependenciesFromTpl: false,
      mockServer: false,
      swaggerFilePath: ymlPath,
      targetDir: testServerPath,
      template: 'git@github.com:acr-lfr/generate-it-typescript-server-client.git',
    };
    openapiNodegen(openapiConfig)
      .then(() => {
        openapiNodegen(openapiConfig)
          .then(() => done())
          .catch((e) => done(e));
      })
      .catch(e => done(e));
  });
});
