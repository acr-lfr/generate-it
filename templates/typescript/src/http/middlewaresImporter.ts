import express from 'express';
import bodyParser from 'body-parser';
import corsMiddleware from './nodegen/middleware/corsMiddleware';
import headersCaching from './nodegen/middleware/headersCaching';
import morgan from 'morgan';
import packageJson from '../../package.json';

const responseHeaders = (app: express.Application) => {
  app.use(corsMiddleware());
  app.use(headersCaching());
};

const requestParser = (app: express.Application) => {
  // parse the body
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
};

const accessLogger = (app: express.Application) => {
  // Log all requests
  app.use(morgan(`[${packageJson.name}] :remote-addr [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]`));
};

/**
 * Injects routes into the passed express app
 * @param app
 */
export default (app: express.Application) => {
  accessLogger(app);
  requestParser(app);
  responseHeaders(app);
};
