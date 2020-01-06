import { Router } from 'express';
const expressAuthMiddle = require('express-auth-middle');
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import config from '../../../config';

export default () => {
  const router = Router({});

  let swaggerFile = config.swaggerFile;
  if (config.swaggerFile === 'latest') {
    const recursive = require('recursive-readdir-sync');
    // read the dir and get the latest file name in the dir.
    let files = recursive('./dredd');
    files.forEach((file: string) => {
      if (path.extname(file) === '.yml') {
        swaggerFile = file;
      }
    });
  }
  let doc = YAML.load(path.resolve(swaggerFile));
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
