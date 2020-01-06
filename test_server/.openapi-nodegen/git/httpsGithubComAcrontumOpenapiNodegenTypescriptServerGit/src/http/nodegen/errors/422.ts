const customError = require('custom-error');
const http422 = customError('http422');

/**
 * This is used when the provided content is not processible but the error is caught by celebrate.
 * If you are trying to throw a celebrate style 422, please read the src/http/nodegen/middleware/handleValidationErrors.ts
 * A simple example that would be caught by the validation middleware:
 * throw {joi: true, data: someobject}
 *
 * Example use of the simple 422:
 // Import it
 import http422 from '@/http/nodegen/errors/422'

 // somewhere in your app, eg a domain throw it
 throw http422();

 * Throwing this custom error will then be caught in the handle 422 middleware
 * src/http/nodegen/middleware/handle422.ts
 *
 * The request will simply get in return a http 422 status code
 */
export default http422;
