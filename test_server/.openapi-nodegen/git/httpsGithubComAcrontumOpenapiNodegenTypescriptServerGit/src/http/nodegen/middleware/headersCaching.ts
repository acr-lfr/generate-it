import express = require('express');

import NodegenRequest from '../../interfaces/NodegenRequest';
import HttpHeadersCacheService from '@/services/HttpHeadersCacheService';

/**
 * Express middleware to control the http headers for caching only
 * @returns {Function}
 */
export default () => {
  return (req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    HttpHeadersCacheService.middleware(req, res, next);
  }
}
