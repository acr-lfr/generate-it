import http423 from '../errors/423';

import NodegenRequest from '../../interfaces/NodegenRequest';
import express = require('express');

/**
 * Required for if an unauthorised response should be thrown from a domain or controller
 * Read: ../errors/423.ts
 * @returns {Function}
 */
export default () => {
  return (err: any, req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    if (err instanceof http423) {
      res.status(423).send();
    } else {
      next(err);
    }
  };
}
