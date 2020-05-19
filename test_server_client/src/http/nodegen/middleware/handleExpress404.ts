import express = require('express');
import NodegenRequest from '../../interfaces/NodegenRequest';

/**
 * Default 404 handler for the express app
 */
export default () => {
  return (req: NodegenRequest, res: express.Response) => {
    res.status(404);

    // respond with json
    if (`${req.headers.accept || ''}`.match('json')) {
      return res.send({error: 'Not found'});
    }
    // default to plain-text. send()
    return res.type('txt').send('Not found');
  };
}
