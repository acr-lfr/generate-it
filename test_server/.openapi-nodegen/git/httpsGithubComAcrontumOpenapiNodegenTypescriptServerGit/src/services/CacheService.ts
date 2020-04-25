import NodegenRequest from '@/http/interfaces/NodegenRequest';
import express = require('express');

class CacheService {

  /**
   * This middleware is injected into a route via the x-cache parameter present in a path object
   * This middleware is called before the route hits the domain.
   * Either call res.json with your cached output or call next to continue the route to the next middleware
   * !! Extend this method as required.
   * @param req - Express js request object
   * @param res - Express js response object
   * @param next - Express js next function
   * @param transformOutputMap - The output object calculated from the output model defined in the yml
   */
  public middleware (req: NodegenRequest, res: express.Response, next: express.NextFunction, transformOutputMap: any) {
    // inject here a redis cache fetch based on your own criteria.
    // generate-it will not overwrite this file, only place it here if it did not already exist.
    // out of the box this function does nothing... how you determine the cache business logic is up to you.
    next();
  }
}

export default new CacheService();
