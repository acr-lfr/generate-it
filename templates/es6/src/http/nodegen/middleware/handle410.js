import http410 from '../errors/410'

/**
 * Required for if an unauthorised response should be thrown from a domain or controller
 * @returns {Function}
 */
export default () => {
  return (err, req, res, next) => {
    if (err instanceof http410) {
      res.status(410).send()
    } else {
      next(err)
    }
  }
}
