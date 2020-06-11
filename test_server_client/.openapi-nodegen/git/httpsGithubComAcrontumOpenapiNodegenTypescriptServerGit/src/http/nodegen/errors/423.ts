const customError = require('custom-error');
const http423 = customError('http423');

/**
 * Example use:
 // Import it
 import http423 from '@/http/nodegen/errors/423'

 // somewhere in your app, eg a domain throw it
 throw http423('Forbidden access attempt');

 * Throwing this custom error will then be caught in the handle 423 middleware
 * src/http/nodegen/middleware/handle423.ts
 *
 * The request will simply get in return a http 423 status code
 */
export default http423;
