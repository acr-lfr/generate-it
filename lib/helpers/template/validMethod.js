/**
 * Checks if a method is a valid HTTP method.
 */
module.exports = (method) => {
  const authorizedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND']
  return (authorizedMethods.indexOf(method.toUpperCase()) !== -1)
}
