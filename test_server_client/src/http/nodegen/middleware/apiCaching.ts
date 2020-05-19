import express = require('express');

import NodegenRequest from '../../interfaces/NodegenRequest';
import CacheService from '@/services/CacheService';

/**
 * Express middleware to control the http headers for caching only
 * @returns {Function}
 */
export default (transformOutputMap: any) => {
  return (req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    CacheService.middleware(req, res, next, transformOutputMap);
  }
}
