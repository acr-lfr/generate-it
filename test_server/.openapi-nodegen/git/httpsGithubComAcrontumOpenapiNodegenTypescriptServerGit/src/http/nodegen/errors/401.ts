const customError = require('custom-error');
const http401 = customError('http401');
/**
 * Example use:
 // Import it
 import http401 from '@/http/nodegen/errors/401'

 // somewhere in your app, eg a domain throw it
 throw http401('Forbidden access attempt');

 * Throwing this custom error will then be caught in the handle 401 middleware
 * src/http/nodegen/middleware/handle401.ts
 *
 * The request will simply get in return a http 401 status code
 */
export default http401;
