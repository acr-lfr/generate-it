import dotenv from 'dotenv';
import ConfigHelperService from './services/ConfigHelperService';

dotenv.config();

/* tslint:disable */
export default {
  // Swagger file
  swaggerFile: ConfigHelperService.withDefault('SWAGGER_FILE', 'latest'),
  swaggerFile_docs: ['SWAGGER_FILE', false, '/api/v1/swagger will return the swagger-ui SWAGGER_FILE if set in the environment variables will override the default value of "latest". This allows you to use an older version of the swagger file for the swagger-ui docs route.'],

  // Instance
  env: ConfigHelperService.withDefault('ENVIRONMENT', 'production'),
  env_docs: ['ENVIRONMENT', false, 'if set will override the default value of "production" typically used for development to gain deeper logging'],
  port: ConfigHelperService.withDefault('PORT', 8000),
  port_docs: ['PORT', false, 'if set will override the default value of 8000 which is the port the express app will be listening on'],

  // Cors white list of URLs
  corsWhiteList: ConfigHelperService.withDefault('CORS_WHITELIST', '*'),
  corsWhiteList_docs: ['CORS_WHITELIST', false, 'if not set will default to the * wildcard meaning the api will not offer any CORS restrictions. You can override this will a commas separated list of FQDs for example "https://www.domain1.com,https://www.domain1.de"'],

  // Authentication
  basicAuthUname: ConfigHelperService.withDefault('BASIC_AUTH_UNAME', 'user'),
  basicAuthUname_docs: ['BASIC_AUTH_UNAME', false, 'http basic auth is used to gain access to the swagger-ui route. The username defaults to y7i7f4ihv4'],
  basicAuthPword: ConfigHelperService.withDefault('BASIC_AUTH_PWORD', 'pw'),
  basicAuthPword_docs: ['BASIC_AUTH_PWORD', false, 'http basic auth is used to gain access to the swagger-ui route. The password defaults to ves54ekjyg'],
  jwtSecret: ConfigHelperService.required('JWT_SECRET'),
  jwtSecret_docs: ['JWT_SECRET', true, 'is the secret string used to encrypt the signature of the JWT token, please read up on JWT tokens if this does not mean anything to you'],

  // Api key
  apiKey: ConfigHelperService.withDefault('API_KEY', false),
};
/* tslint:enable */
