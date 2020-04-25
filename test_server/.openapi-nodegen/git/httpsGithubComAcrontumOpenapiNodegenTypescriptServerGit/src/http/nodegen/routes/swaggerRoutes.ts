import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import config from '../../../config';
const expressAuthMiddle = require('express-auth-middle');

export default () => {
  const router = Router({});

  let doc = YAML.load(path.resolve('openapi-nodegen-api-file.yml'));
  // Middleware for basicauth and xauth
  router.use(
    expressAuthMiddle({
      methods: ['basic-auth'],
      credentials: {
        basicAuthUname: config.basicAuthUname,
        basicAuthPword: config.basicAuthPword,
      },
      challenge: 'Protected area',
    }),
  );

  router.use('/', (req: any, res: any, next: any) => {
    if (doc.swagger) {
      doc.host = req.get('host');
    }
    req.swaggerDoc = doc;
    return next();
  }, swaggerUi.serve, swaggerUi.setup());

  return router;
};
