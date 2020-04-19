import NodegenRequest from '@/http/nodegen/interfaces/NodegenRequest';
import express = require('express');
import http401 from '@/http/nodegen/errors/401';

class PermissionService {
  middleware (req: NodegenRequest, res: express.Response, next: express.NextFunction, permission: string) {
    // Please inject your own logic here.
    /**
     * This will never be overridden.
     * If the swagger path contains x-permission this middleware is used.
     * For example, assuming the object appRole was a key value object where each key was a
     * role name and each value was an array of permissions this could be a solution:
     * if(appRole[req.jwtData.role].contains(permission)) next();
     * else thrown http401('Not allowed here');
     */
    next();
  }
}
export default new PermissionService()
