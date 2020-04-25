import NodegenRequest from '@/http/interfaces/NodegenRequest';
import express = require('express');

class HttpHeadersCacheService {
  /**
   * Default output is to not cache anything and to do so by sending no-cache headers in the response.
   * You may wish to change this for specific routes based on your application
   * @param req
   * @param res
   * @param next
   */
  middleware (req: NodegenRequest, res: express.Response, next: express.NextFunction) {
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.header('Expires', 'Thu, 19 Nov 1981 08:52:00 GMT');
    next();
  }
}

export default new HttpHeadersCacheService();
