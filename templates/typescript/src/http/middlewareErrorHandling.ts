import express from 'express';

import handleValidationErrors from './nodegen/middleware/handleValidationErrors'
import handle404 from './nodegen/middleware/handle404'
import handle500 from './nodegen/middleware/handle500'

/**
 * Injects routes into the passed express app
 * @param app
 */
export default (app: express.Application) => {
  // Last but not least, if no route has reacted then this is a 404
  app.use(handle404());

  // Validation requests
  app.use(handleValidationErrors());

  // Handle 500 errors
  app.use(handle500());
};
