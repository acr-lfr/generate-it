const customError = require('custom-error');
const http409 = customError('http409');

/**
 * Example use:
 // Import it
 import http409 from '@/http/nodegen/errors/409'

 // somewhere in your app, eg a domain throw it
 throw http409('request could not be completed due to a conflict with the current state of the resource');

 * Throwing this custom error will then be caught in the handle 409 middleware
 * src/http/nodegen/middleware/handle409.ts
 *
 * The request will simply get in return a http 409 status code
 */
export default http409;
