import * as fs from 'fs';
import * as path from 'path';
import { ConfigExtendedBase, Path, Schema, TemplateRenderer } from 'generate-it';
import { mockItGenerator } from 'generate-it-mockers';
import prettier from 'generate-it/build/lib/helpers/prettyfyRenderedContent';
import SwaggerUtils from 'generate-it/build/lib/helpers/SwaggerUtils';

interface Context extends ConfigExtendedBase {
  src: string;
  dest: string;
  root: string;
  filename: string;
  TemplateRenderer: TemplateRenderer;
}

type ParamResponse = Schema.Schema | Schema.Response | Schema.Parameter | string;

type Variables = { [varname: string]: ParamResponse };

type ReqParams = Record<Schema.Parameter['in'], Variables>;

interface ExtractedContent {
  templateFullPath: string;
  pathName: string;
  methods: string[];
  params: {
    [method: string]: {
      reqParams?: ReqParams;
      responses?: Variables;
      security?: Record<string, string[]>[];
    };
  };
}

interface DomainSpec {
  className: string;
  domainName: string;
  exports: Map<string, string>;
  securityDefinitions: Record<string, Schema.Security>;
  paths: {
    [fullPath: string]: ExtractedContent;
  };
}

interface Domains {
  [opName: string]: DomainSpec;
}

interface TestData {
  fullPath: string;
  method: string;
  data: ExtractedContent;
  domainSpec: DomainSpec;
}

const ucFirst = (input: string): string => `${input.charAt(0).toUpperCase()}${input.slice(1)}`;

const pascalCase = (input: string): string =>
  input.replace(/([0-9].|^[a-z])|[^a-zA-Z0-9]+(.)?/g, (_, s = '', q = '') => (s || q).toUpperCase());

const camelCase = (input: string): string =>
  input.replace(/([0-9].)|[^a-zA-Z0-9]+(.)?/g, (_, s = '', q = '', i) => (i ? (s || q).toUpperCase() : s || q));

const extractReqParams = (params: Schema.Parameter[], exportData: Map<string, string>): ReqParams => {
  if (!params?.length) {
    return null;
  }

  const variables = {} as ReqParams;

  for (const schema of params || []) {
    const varName = camelCase(`${schema.in}-${schema.name}`);
    const paramDef = ((schema as Schema.BodyParameter).schema || schema) as Schema.Schema;

    variables[schema.in] = {
      ...variables[schema.in],
      [varName]: paramDef,
    };

    exportData.set(varName, `export const ${varName} = ${JSON.stringify(mockItGenerator(paramDef))};`);
  }

  return variables;
};

const extractResponses = (responses: Schema.Spec['responses']): Variables => {
  let firstSuccess: string = null;
  const variables: Variables = {};

  Object.entries(responses || {}).forEach(([code, schema]) => {
    if ((!firstSuccess && /[23]../.test(code)) || (/^3/.test(firstSuccess) && /^2/.test(code))) {
      firstSuccess = code;
    }
    variables[code] = schema;
  });

  if (firstSuccess) {
    variables[`success`] = firstSuccess;
  }

  return variables;
};

const parsePathData = (pathData: Path, exportData: Map<string, string>): ExtractedContent['params'] => {
  const params: ExtractedContent['params'] = {};

  Object.entries(pathData || {}).forEach(([method, reqData]) => {
    if (method === 'endpointName' || method === 'groupName') {
      return;
    }

    params[method] = {
      reqParams: extractReqParams(reqData.parameters as Schema.Parameter[], exportData),
      responses: extractResponses(reqData.responses as Schema.Spec['responses']),
      security: reqData.security,
    };
  });

  return params;
};

const parseAllPaths = (spec: Schema.Spec): Domains => {
  let opName = '';
  const domains: Domains = {};

  Object.entries(spec.paths as Record<string, Path>).forEach(([fullReqPath, pathData]) => {
    if (opName != pathData.groupName) {
      opName = pathData.groupName;

      const className = pascalCase(opName);

      domains[opName] = domains[opName] || {
        className,
        domainName: `${className}Domain`,
        paths: {},
        exports: new Map<string, string>(),
        securityDefinitions: spec.securityDefinitions,
      };
    }

    const params = parsePathData(pathData, domains[opName].exports);

    domains[opName].paths[fullReqPath] = {
      templateFullPath: fullReqPath.replace(
        /[\$\{:]+([^\/\}:]+)\}?/,
        (_, s) => `\${testParams?.path?.${s} ?? path${ucFirst(s)}\}`
      ),
      pathName: camelCase(fullReqPath),
      params,
      methods: Object.keys(params),
    };
  });

  return domains;
};

const getResponseExport = (method: string, name: string, schema: ParamResponse): string => {
  if (!(schema as Schema.Response).schema) {
    return 'Joi.object({}),';
  }

  return SwaggerUtils.pathParamsToJoi(schema, { paramTypeKey: 'body' as any });
};

const getValidator = (validatorSchemas: string[]) => `\
export const validationSchemas: Record<string, Joi.AnySchema> = {
${validatorSchemas.join('\n')}
}

export const responseValidator = (responseKey: string, schema: any): Joi.ValidationResult => {
return validationSchemas[responseKey].validate(schema);
}`;

const buildMethodDataFile = (
  testData: TestData
): { dataTemplate: string; stubTemplate: string; validatorSchema: string[] } => {
  const { method, data, domainSpec } = testData;
  const requestParts: string[] = [`.${method}(\`\${root}${data.templateFullPath}\`)`];
  const methodParams = data.params[method];
  const queryVars: string[] = [];

  if (methodParams.reqParams?.query) {
    queryVars.push(
      ...Object.entries(methodParams.reqParams.query).map(
        ([key, value]) => `${(value as Schema.Parameter).name}: ${key}`
      )
    );
  }

  if (methodParams.reqParams?.body) {
    const [name] = Object.keys(methodParams.reqParams.body);
    requestParts.push(`.send(testParams?.body ?? ${name})`);
  }

  methodParams.security?.forEach?.((security) => {
    Object.entries(security).forEach(([name]) => {
      const def = domainSpec.securityDefinitions?.[name];
      if (def) {
        switch (def.type) {
          case 'basic':
            requestParts.push(`.set('Authorization', 'Basic base64string')`);
            break;
          case 'apiKey':
            if (def.in === 'query') {
              queryVars.push(`${def.name}: 'apiKey'`);
            } else {
              requestParts.push(`.set('${def.name}', 'apiKey')`);
            }
            break;
          case 'oauth2': // TODO
            if ((def as Schema.OAuth2AccessCodeSecurity).tokenUrl) {
              queryVars.push(`tokenUrl: '${(def as Schema.OAuth2AccessCodeSecurity).tokenUrl}'`);
            }
            if ((def as Schema.OAuth2AccessCodeSecurity).authorizationUrl) {
              queryVars.push(`authorizationUrl: '${(def as Schema.OAuth2AccessCodeSecurity).authorizationUrl}'`);
            }
            queryVars.push(`scope: '${Object.keys(def.scopes || {}).join(',')}'`);
            break;
        }
      }
    });
  });

  if (queryVars?.length) {
    requestParts.push(`.query(testParams?.query ?? { ${queryVars.join(', ')} })`);
  }

  const successCode = methodParams?.responses?.success as string;
  const successResponse = methodParams?.responses?.[successCode];
  const successSchema = (successResponse as Schema.Response)?.schema ?? successResponse;

  const responseName = `${data.pathName}${ucFirst(method)}`;
  const validatorSchema: string[] = [];
  let responseKey = 'body';

  Object.entries(methodParams.responses).forEach(([name, schema]) => {
    if (name === 'success') {
      return;
    }
    const varName = `${responseName}${name}`;
    const responseValidator = getResponseExport(method, varName, schema);

    validatorSchema.push(`  ${varName}: ${responseValidator}`);
    if (name === successCode) {
      validatorSchema.push(`  ${responseName}Success: ${responseValidator}`);
    }

    if (['string', 'number', 'integer', 'boolean'].includes((schema as Schema.Response)?.schema?.type)) {
      responseKey = 'text';
    }
  });

  if (validatorSchema?.length) {
    domainSpec.exports.set('responseValidator', 'true');
  }

  const testName = `${data.pathName}${ucFirst(method)}`;
  const statusCode = successCode || 200;

  const dataTemplate = `\
export const ${testName}: TestRequest = {
  specName: 'can ${method.toUpperCase()} ${testData.fullPath}',
  testKey: '${testName}',
  getPath: (testParams?: TestParams, root = baseUrl): string => \`\${root}${data.templateFullPath}\`,
  request: (testParams?: TestParams, root = baseUrl): supertest.Test =>
    request
      ${requestParts.join('\n      ')}
      .expect(({ status, ${responseKey} }) => {
        expect(status).toBe(testParams?.statusCode ?? ${statusCode});
        expect(${responseKey}).toBeDefined();${
    successSchema
      ? `
        const validated = responseValidator(\`${testName}\${testParams?.statusCode ?? ${statusCode}}\`, ${responseKey});
        if (validated.error) {
          process.stderr.write(\`\\n\${JSON.stringify({validationError: validated?.error?.details})}\\n\`);
        }
        expect(!!validated.error).toBe(false);`
      : ''
  }
      }),
};`;

  const stubTemplate = `\
  it('can ${method.toUpperCase()} ${testData.fullPath}', async () => {
    const testData: TestData = {};
    await Test${domainSpec.domainName}.tests.${testName}.request(testData);
  });`;

  return { dataTemplate, stubTemplate, validatorSchema };
};

const importOrDefineJwt = (): string => {
  if (fs.existsSync('src/http/nodegen/interfaces/JwtAccess.ts')) {
    return `import { JwtAccess } from '@/http/nodegen/interfaces/JwtAccess';`;
  }

  return '\nexport type JwtAccess = Record<string, any>;';
};

const generateTestFile = (domainName: string, suiteBody: string[], imports = ''): string => `\
import { baseUrl, request, TestParams, TestRequest } from '@/http/nodegen/tests';
import * as supertest from 'supertest';
${imports ? imports + '\n' : ''}
${suiteBody.join('\n\n')}
`;

const generateIndexFile = (toImport: string[], toExport: string[]): string => `\
import app from '@/app';
import { HttpStatusCode } from '@/http/nodegen/errors';
import { NodegenRequest } from '@/http/nodegen/interfaces';
import { default as WorkerService } from '@/http/nodegen/request-worker/WorkerService';
import { baseUrl as root } from '@/http/nodegen/routesImporter';
import { default as AccessTokenService } from '@/services/AccessTokenService';
import { NextFunction, RequestHandler, Response } from 'express';
import { default as supertest } from 'supertest';
${toImport?.length ? toImport.sort().join('\n') : ''}

export interface TestParams {
  query?: Record<string, any>;
  body?: Record<string, any>;
  path?: Record<string, any>;
  headers?: Record<string, any>;
  statusCode?: number;
  // form, other supertest stuff
}

export interface TestRequest {
  request(testParams?: TestParams): supertest.Test;
  getPath(testParams?: TestParams, baseUrl?: string): string;
  specName: string;
  testKey: string;
}

export type TestData = {};

export interface GeneratedTestDomain {
  tests: Record<string, TestRequest>;
  data?: Record<string, TestData>;
}

jest.mock('morgan', () => () => (req: NodegenRequest, res: Response, next: NextFunction) => next());

export const baseUrl = root.replace(/\\/*$/, '');
export let request: supertest.SuperTest<supertest.Test>;

export const ResponseCodes = {
  delete: [HttpStatusCode.OK, HttpStatusCode.NO_CONTENT],
  get: [HttpStatusCode.OK],
  patch: [HttpStatusCode.NO_CONTENT],
  post: [HttpStatusCode.CREATED],
  put: [HttpStatusCode.CREATED, HttpStatusCode.NO_CONTENT],
};

export const setupTeardown = {
  beforeAll: async () => {
    request = supertest((await app(0)).expressApp);
  },
  afterEach: () => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  },
  afterAll: async () => {
    await WorkerService.close();
  }
};

export const defaultSetupTeardown = () => {
  beforeAll(setupTeardown.beforeAll);
  afterEach(setupTeardown.afterEach);
  afterAll(setupTeardown.afterAll);
};

/**
 * Auth middleware mocker
 *
 * By default, a simple pass-through middleware is used (req, res, next) => next()
 *
 * If your auth flow requires side-effects (eg setting req.user = 'something') then
 * you will want to pass in a custom middleware mocker to handle that case
 *
 * @param {RequestHandler}  middleware  Replaces AccessTokenService.validateRequest
 */
export const mockAuth = (middleware?: RequestHandler) => {
  jest
    .spyOn(AccessTokenService, 'validateRequest')
    .mockImplementation(
      middleware ||
        ((req: NodegenRequest, res: Response, next: NextFunction) => next())
    );
};

${toExport?.length ? toExport.join('\n\n') : ''}
`;

const generateTestStub = (basePath: string, domainSpec: DomainSpec, tests: string[], useAuth?: boolean): boolean => {
  basePath = basePath.replace(/\/+$/, '');

  const outputPath = `${basePath}/${domainSpec.domainName}.api.spec.ts`;
  if (fs.existsSync(outputPath)) {
    return false;
  }
  fs.mkdirSync(basePath, { recursive: true });

  const template = `\
import { defaultSetupTeardown,${useAuth ? 'mockAuth,' : ''} TestData, Test${
    domainSpec.domainName
  } } from '@/http/nodegen/tests';

defaultSetupTeardown();

describe('${domainSpec.domainName}', () => {
  // setup - run before suite (one time)
  beforeAll(async () => {});

  // setup - run before every test
  beforeEach(async () => {${
    useAuth
      ? `

    mockAuth();  // Disable auth middleware
  `
      : ''
  }});

  // teardown - run after every tests
  afterEach(async () => {});

  // teardown - run once after suite succeeds
  afterAll(async () => {});

  ${tests.join('\n\n')}
});
`;

  createFormattedFile(outputPath, template);

  return true;
};

const mapKeys = (map: Map<any, any>) => Array.from(map, ([key]) => key);

const mapValues = (map: Map<any, any>) => Array.from(map, ([_, value]) => value);

const createFormattedFile = (path: string, data: string) => fs.writeFileSync(path, prettier(data, '.ts'));

const writeTestDataFile = (path: string, domainSpec: DomainSpec, validatorSchemas: string[]) => {
  const dataExports: string[] = mapValues(domainSpec.exports).filter((key) => key !== 'true');
  if (validatorSchemas?.length) {
    dataExports.unshift(`import * as Joi from 'joi';`);
    dataExports.push(getValidator(validatorSchemas));
  }
  createFormattedFile(path, dataExports.join('\n\n'));
};

const buildSpecFiles = (ctx: Context): void => {
  if (!ctx.nodegenRc?.helpers?.tests) {
    return;
  }

  const testOutput = path.join(ctx.targetDir, ctx.nodegenRc?.helpers?.tests?.outDir || 'src/domains/__tests__');

  const domains = parseAllPaths(ctx.swagger);

  const indexImports: string[] = [];
  const indexExports: string[] = [];

  Object.entries(domains).forEach(([opName, domainSpec]) => {
    const specFileName = `${domainSpec.domainName}`;
    const exportables = [`tests: ${specFileName}Tests`];
    const dataTemplates: string[] = [];
    const stubTemplates: string[] = [];
    const validatorSchemas: string[] = [];
    let useAuth: boolean = false;

    Object.entries(domainSpec.paths).forEach(([fullPath, data]) => {
      data.methods.forEach((method) => {
        const { dataTemplate, stubTemplate, validatorSchema } = buildMethodDataFile({
          fullPath,
          method,
          data,
          domainSpec,
        });
        dataTemplates.push(dataTemplate);
        stubTemplates.push(stubTemplate);
        validatorSchemas.push(...validatorSchema);
        useAuth = useAuth || !!data.params[method]?.security?.length;
      });
    });

    if (domainSpec.exports.size > 0) {
      writeTestDataFile(`${ctx.dest}/${specFileName}.data.ts`, domainSpec, validatorSchemas);
      exportables.push(`data: ${specFileName}Data`);

      indexImports.push(`import * as ${specFileName}Data from './${specFileName}.data';`);
    }

    indexImports.push(`import * as ${specFileName}Tests from './${specFileName}';`);
    indexExports.push(`export const Test${specFileName}: GeneratedTestDomain = { ${exportables.join(', ')} };`);

    const importString = domainSpec.exports.size
      ? `import { ${mapKeys(domainSpec.exports).sort().join(', ')} } from './${specFileName}.data';`
      : null;
    createFormattedFile(
      `${ctx.dest}/${specFileName}.ts`,
      generateTestFile(domainSpec.domainName, dataTemplates, importString)
    );
    generateTestStub(testOutput, domainSpec, stubTemplates, useAuth);
  });

  createFormattedFile(`${ctx.dest}/index.ts`, generateIndexFile(indexImports, indexExports));
};

export default buildSpecFiles;
