/**
 * Checks if a method is a valid HTTP method.
 */
module.exports = (method) => {
  const authorized_methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND']

  return (authorized_methods.indexOf(method.toUpperCase()) !== -1)
}
