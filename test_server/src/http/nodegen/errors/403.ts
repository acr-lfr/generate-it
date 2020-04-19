const customError = require('custom-error');
const http403 = customError('http403');
/**
 * Example use:
// Import it
import http403 from '@/http/nodegen/errors/403'

// somewhere in your app, eg a domain throw it
throw http403('Forbidden access attempt');

 * Throwing this custom error will then be caught in the handle 403 middleware
 * src/http/nodegen/middleware/handle403.ts
 *
 * The request will simply get in return a http 403 status code
 */
export default http403;
