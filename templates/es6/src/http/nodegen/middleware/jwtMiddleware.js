import JwtService from '../../../services/JwtService'

export default (headerName) => {
  return (req, res, next) => {
    const deny = (e, msg = 'Invalid auth token provided', tokenProvided = '') => {
      console.error(e)
      res.status(401).json({
        message: msg,
        token: tokenProvided,
      })
    }
    let tokenRaw = req.headers[headerName.toLowerCase()] || req.headers[headerName] || false
    let token = ''
    if (tokenRaw) {
      let tokenParts = tokenRaw.split('Bearer ')
      if (tokenParts.length > 0) {
        token = tokenParts[1]
      }
    } else {
      return deny('No token to parse', 'No auth token provided.', JSON.stringify(req.headers))
    }

    // Please apply here your own token verification logic
    JwtService.verifyAccessJWT(token)
      .then(decodedToken => {
        req.jwtData = decodedToken
        req.originalToken = token
        next()
      })
      .catch(() => {
        deny('Auth signature invalid.', 'Invalid auth token!')
      })
  }
}
