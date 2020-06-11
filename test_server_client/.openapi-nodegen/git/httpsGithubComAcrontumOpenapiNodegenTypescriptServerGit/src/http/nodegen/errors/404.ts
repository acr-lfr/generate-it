const customError = require('custom-error');
const http404 = customError('http404');

/**
 * Example use:
 // Import it
 import http404 from '@/http/nodegen/errors/404'

 // somewhere in your app, eg a domain throw it
 throw http404('Forbidden access attempt');

 * Throwing this custom error will then be caught in the handle 404 middleware
 * src/http/nodegen/middleware/handle404.ts
 *
 * The request will simply get in return a http 404 status code
 */
export default http404;
