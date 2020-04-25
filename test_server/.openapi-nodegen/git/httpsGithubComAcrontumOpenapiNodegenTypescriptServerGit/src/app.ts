import express from 'express';

import middlewareErrorHandling from './http/middlewareErrorHandling';
import middlewaresImporter from './http/middlewaresImporter';
import routesImporter from './http/nodegen/routesImporter';

const app = express();

middlewaresImporter(app);
routesImporter(app);
middlewareErrorHandling(app);

export default app;
