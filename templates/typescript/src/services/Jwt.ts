import jwt from 'jsonwebtoken';
import _ from 'lodash';
import config from '../config';

interface JwtDetails {
  maxAge: number;
  sessionData: any;
}

class Jwt {
  public generateJWToken(details: JwtDetails) {
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

  public verifyJWTToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.jwtSecret, (err: any, decodedToken: any) => {
        if (err || !decodedToken) {
          return reject(err);
        }
        resolve(decodedToken);
      });
    });
  }
}

export default new Jwt();
