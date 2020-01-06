# openapi-nodegen typescript server template files

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [{{swagger.info.title}}](#swaggerinfotitle)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## API Spec file helpers
These templates inject into the code helpful elements depending on the provided api file.

#### Permission helper
`src/http/nodegen/routes/___op.ts.njk` will look for the `x-permission` attribute within a path object eg:
```
x-permission: adminUsersDelete
```
It will then inject the permission middleware to the give path and pass the said middleware the provided permission string. In the above case, "adminUserDelete" will be passed.

#### NodegenRC Helpers
The default `.nodegenrc` will contain:
```json
{
  "nodegenDir": "src/http/nodegen",
  "nodegenMockDir": "src/domains/__mocks__",
  "nodegenType": "server",
  "helpers": {
    "stub": {
      "jwtType": "JwtAccess",
      "requestType": "NodegenRequest"
    }
  }
}
```
The stub helpers will mean the domain method types will be `JwtAccess` or `NodegenRequest` opposed to `any`.

The `NodegenRequest` interface is provided by these templates out of the box so nothing extra required.

The `JwtAccess` interface is not provided, it expects that you have in your api file a definition by this name. You can see an example in the core: [example JwtAccess interface](https://github.com/acrontum/openapi-nodegen/blob/develop/test_swagger.yml#L176)

#### Access validation service
Within the nodegen folder there is a middlware `accessTokenMiddleware.ts` injected into the routes when a security attribute is found in the api file.

This middleware passes the details onto the provided service: `AccessTokenService.validateRequest(req, res, next, headerNames)`

Out of the box it is quite simple and it is expected that you inspect and update this service to fit the needs of your app.

#### Caching
The middleware `src/http/nodegen/middleware/headersCaching.ts` is a proxy function to `HttpHeadersCacheService`.

This allows you to control the cache headers returned. Alternatively you may wish to inject your wn caching service logic here as you have full access to the request and response object.

#### Errors
However nice all the automated layer is, once in the domain method it is common to want to throw some of these error codes from the domain. Each of the error helpers here: `src/http/nodegen/errors` have their own handle middleware. For more info on each take a read of the comments within the files.

## Setup
In a new directory run: `npm init`

Add to the dev dependencies openapi-nodegen
 - run: `npm i --save-dev openapi-nodegen`

Add the nodegen generate the server to the package.json scripts object. The following will load a local swagger file api.1.0.0.yml and generate the server with the given git repository:
```
  "scripts": {
      "generate:nodegen": "openapi-nodegen ./swagger/api_1.0.0.yml -t https://github.com/acrontum/openapi-nodegen-typescript-server.git",
```

#### Tip for older versions of openapi-nodegen

Reference a tag:
```
  "scripts": {
      "generate:nodegen": "openapi-nodegen ./swagger/api_1.0.0.yml -t https://github.com/acrontum/openapi-nodegen-typescript-server.git#3.0.6",
```
