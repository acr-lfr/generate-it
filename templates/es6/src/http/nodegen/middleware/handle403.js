import http403 from '../errors/403';

/**
 * Required for if an unauthorised response should be thrown from a domain or controller
 * @returns {Function}
 */
export default () => {
  return (err, req, res, next) => {
    if (err instanceof http403) {
      res.status(403).send();
    } else {
      next(err);
    }
  };
}
