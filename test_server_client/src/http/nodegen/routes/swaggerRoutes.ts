import { Router } from 'express';
import expressAuthMiddle from 'express-auth-middle';
import { ValidateSwitchType } from 'express-auth-middle/build/enums/ValidateSwitchType';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import YAML from 'yamljs';
import config from '@/config';

export default () => {
  const router = Router({});

  let doc = YAML.load(path.resolve('openapi-nodegen-api-file.yml'));
  // Middleware for basicauth and xauth
  const credentials = config.swaggerBasicAuth ? {
    basicAuthArray: config.swaggerBasicAuth
  } : {
    // This block is a simple fall back for the older typescript server templates.
    // If you are here wondering.. your config object should contain:
    /**
     *  // Swagger file
     *  loadSwaggerUIRoute: ConfigHelper.withDefault('LOAD_SWAGGER_UI_ROUTE', false),
     *  swaggerBasicAuth: [{
     *    basicAuthUname: String(ConfigHelper.withDefault('SWAGGER_BASIC_AUTH_UNAME', 'user')),
     *    basicAuthPword: String(ConfigHelper.withDefault('SWAGGER_BASIC_AUTH_PWORD', 'pw')),
     *  }],
     */
    basicAuthUname: 'user',
    basicAuthPword: 'pw'
  };

  router.use(
    expressAuthMiddle({
      methods: [ValidateSwitchType['basic-auth']],
      credentials,
      challenge: 'Protected area',
    }),
  );

  router.use('/', (req: any, res: any, next: any) => {
    if (doc.swagger) {
      doc.host = req.headers['x-forwarded-host'] || req.headers['host'] || doc.host;
      const basePath = process.env.API_BASE_PATH || doc.basePath || undefined;
      if (basePath) {
        doc.basePath = basePath;
      }
    }
    req.swaggerDoc = doc;
    return next();
  }, swaggerUi.serve, swaggerUi.setup());

  return router;
};
