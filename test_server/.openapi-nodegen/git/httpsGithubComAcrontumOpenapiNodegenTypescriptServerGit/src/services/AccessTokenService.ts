import jwt from 'jsonwebtoken';
import _ from 'lodash';
import config from '../config';
import NodegenRequest from '@/http/nodegen/interfaces/NodegenRequest';
import express = require('express');

interface JwtDetails {
  maxAge: number;
  sessionData: any;
}

class AccessTokenService {
  /**
   * Used by the validateRequest method
   * @param res
   * @param e
   * @param msg
   * @param headersProvidedString
   */
  private denyRequest (
    res: express.Response,
    e: any = 'AccessTokenService did not match the given keys or tokens',
    msg: string = 'Invalid auth token provided',
    headersProvidedString: string = '',
  ) {
    console.error(e);
    res.status(401).json({
      message: msg,
      token: headersProvidedString,
    });
  }

  /**
   * Checks a JWT or API key differentiating between the two with the existence or not of Bearer.
   * !! Extend this method as required.
   * !! Note the src/http/nodegen/security/definitions.ts.njk contains all security definitions
   * @param req
   * @param res
   * @param next
   * @param headerNames
   */
  public validateRequest (req: NodegenRequest, res: express.Response, next: express.NextFunction, headerNames: string[]) {
    let jwtToken: string;
    let apiKey: string;
    for (let i = 0; i < headerNames.length; ++i) {
      let tokenRaw = String(req.headers[headerNames[i].toLowerCase()] || req.headers[headerNames[i]] || '');
      if (tokenRaw.length > 0) {
        // Assuming this API will be used more frequently by humans with JWT tokens check for JWT 1st.
        let tokenParts = tokenRaw.split('Bearer ');
        if (tokenParts.length > 0) {
          // this is a JWT token
          jwtToken = tokenParts[1];
          break;
        } else {
          // This is a token but not JWT thus API key
          apiKey = tokenParts[1];
          break;
        }
      }
    }

    if (!jwtToken && !apiKey) {
      return this.denyRequest(
        res,
        'No token to parse',
        'No auth token provided.',
        JSON.stringify(req.headers)
      );
    }
    if (jwtToken) {
      // verify the JWT token
      this.verifyJWT(jwtToken)
        .then((decodedToken: any) => {
          req.jwtData = decodedToken;
          req.originalToken = jwtToken;
          next();
        })
        .catch(() => {
          this.denyRequest(res);
        });
    } else if(config.apiKey === apiKey) {
      // verify the access token
      next();
    } else {
      this.denyRequest(res)
    }
  }

  /**
   * Generates a JTW token
   * @param details
   */
  public generateJWToken (details: JwtDetails) {
    if (typeof details.maxAge !== 'number') {
      details.maxAge = 3600;
    }

    details.sessionData = _.reduce(details.sessionData || {}, (memo: any, val: any, key: string) => {
      if (typeof val !== 'function' && key !== 'password') {
        memo[key] = val;
      }
      return memo;
    }, {});
    return jwt.sign({
      data: details.sessionData,
    }, config.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: details.maxAge,
    });
  }

  public verifyJWT (token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.jwtSecret, (err: any, data: any) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }
}

export default new AccessTokenService();
