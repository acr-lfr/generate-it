import AccessTokenService, { ValidateRequestOptions } from '@/services/AccessTokenService';
import NodegenRequest from '../../interfaces/NodegenRequest';
import express = require('express');

export default (headerNames: string[], options?: ValidateRequestOptions) => {
  return (req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    /**
     * The validate request should call the next function on successful token validation
     */
    AccessTokenService.validateRequest(req, res, next, headerNames, options);
  };
}
