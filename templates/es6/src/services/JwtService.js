import jwt from 'jsonwebtoken'
import config from '../config'

class JwtService {
  async verifyAccessJWT (token) {
    return jwt.verify(token, config.jwtAccessSecret)
  }

  async verifyRenewalJWT (token) {
    return jwt.verify(token, config.jwtRenewalSecret)
  }

  generateRenewalToken (user) {
    return jwt.sign(
      { data: this.buildRenewalTokenSessionData(user) },
      config.jwtRenewalSecret,
      { expiresIn: config.jwtRenewalMaxAge }
    )
  }

  generateAccessToken (user) {
    return jwt.sign(
      { data: this.buildAccessTokenSessionData(user) },
      config.jwtAccessSecret,
      { expiresIn: config.jwtAccessMaxAge }
    )
  }

  buildAccessTokenSessionData (user) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }

  buildRenewalTokenSessionData (user) {
    return {
      id: user.id,
    }
  }
}

export default new JwtService()
