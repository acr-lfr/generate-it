import express = require('express');

import NodegenRequest from '../interfaces/NodegenRequest'

/**
 * This will catch any error that is not first caught by any of the other error handlers
 */
export default () => {
  return (err: any, req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    if (err) return res.status(500).send(JSON.stringify({ message: err.message }));
    next(err)
  }
}
