import jwt from 'jsonwebtoken';
import _ from 'lodash';
import config from '../config';

interface JwtDetails {
  maxAge: number;
  sessionData: any;
}

class JwtService {
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

  public async verifyAccessJWT(token: string) {
    return jwt.verify(token, config.jwtSecret)
  }
}

export default new JwtService();
