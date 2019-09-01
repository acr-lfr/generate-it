import JwtService from '../../../services/JwtService';

import NodegenRequest from '../interfaces/NodegenRequest';
import express = require('express');

export default (headerName: string) => {
  return (req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    const deny = (e: any, msg = 'Invalid auth token provided', tokenProvided = '') => {
      console.error(e);
      res.status(401).json({
        message: msg,
        token: tokenProvided,
      });
    };
    let tokenRaw = String(req.headers[headerName.toLowerCase()] || req.headers[headerName] || '');
    let token = '';
    if (tokenRaw.length > 0) {
      let tokenParts = tokenRaw.split('Bearer ');
      if (tokenParts.length > 0) {
        token = tokenParts[1];
      }
    } else {
      return deny('No token to parse', 'No auth token provided.', JSON.stringify(req.headers));
    }

    // Please apply here your own token verification logic
    JwtService.verifyAccessJWT(token)
      .then((decodedToken: any) => {
        req.jwtData = decodedToken;
        req.originalToken = token;
        next();
      })
      .catch(() => {
        deny('Auth signature invalid.', 'Invalid auth token!');
      });
  };
}
