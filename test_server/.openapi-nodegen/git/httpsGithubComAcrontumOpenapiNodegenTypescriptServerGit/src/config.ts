import dotenv from 'dotenv';
import ConfigHelper from 'openapi-nodegen-config-helper';

dotenv.config();

/* tslint:disable */
/**
 * Add and remove config that you need.
 */
export default {
  // Swagger file
  swaggerFile: ConfigHelper.withDefault('SWAGGER_FILE', 'latest'),

  // Instance
  env: ConfigHelper.withDefault('ENVIRONMENT', 'production'),
  port: ConfigHelper.withDefault('PORT', 8000),

  // Cors white list of URLs
  corsWhiteList: ConfigHelper.withDefault('CORS_WHITELIST', '*'),

  // Authentication
  basicAuthUname: ConfigHelper.withDefault('BASIC_AUTH_UNAME', 'user'),
  basicAuthPword: ConfigHelper.withDefault('BASIC_AUTH_PWORD', 'pw'),
  jwtSecret: ConfigHelper.required('JWT_SECRET'),

  // Api key
  apiKey: ConfigHelper.withDefault('API_KEY', false),
};
/* tslint:enable */
