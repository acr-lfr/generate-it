import http409 from '../errors/409';
import express = require('express');

import NodegenRequest from '../../interfaces/NodegenRequest';

/**
 * Required for if an unauthorised response should be thrown from a domain or controller
 * Read: ../errors/409.ts
 * @returns {Function}
 */
export default () => {
  return (err: any, req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    if (err instanceof http409) {
      res.status(409).send();
    } else {
      next(err);
    }
  };
}
