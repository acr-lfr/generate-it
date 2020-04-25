const customError = require('custom-error');
const http410 = customError('http410');

/**
 * Example use:
 // Import it
 import http410 from '@/http/nodegen/errors/410'

 // somewhere in your app, eg a domain throw it
 throw http410('Forbidden access attempt');

 * Throwing this custom error will then be caught in the handle 410 middleware
 * src/http/nodegen/middleware/handle410.ts
 *
 * The request will simply get in return a http 410 status code
 */
export default http410;
