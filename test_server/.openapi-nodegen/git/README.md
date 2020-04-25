# openapi-nodegen typescript server template files

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [API Spec file helpers/features](#api-spec-file-helpersfeatures)
    - [Access full request in domain](#access-full-request-in-domain)
    - [Allow non authenticated request to access domain](#allow-non-authenticated-request-to-access-domain)
    - [Input/ouput filters](#inputouput-filters)
    - [Permission helper](#permission-helper)
    - [NodegenRC Helpers](#nodegenrc-helpers)
    - [Access validation service](#access-validation-service)
    - [Caching](#caching)
    - [Errors](#errors)
- [Setup](#setup)
    - [Tip 1 local api file pointer](#tip-1-local-api-file-pointer)
    - [Tip 2 for older versions of openapi-nodegen](#tip-2-for-older-versions-of-openapi-nodegen)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## API Spec file helpers/features
These templates inject into the code helpful elements depending on the provided api file.

#### Access full request in domain
Accessing the full request object is handled by the core feature: [pass-full-request-object-to-___stub-method](https://acrontum.github.io/openapi-nodegen/#/_pages/features?id=pass-full-request-object-to-___stub-method)

#### Allow non authenticated request to access domain
With some API designs there is the need to offer 1 API route which returns content for authenticated users and non-authenticated users. The content could be a newsfeed for example with authenticated users getting a extra attributes in the new objects returned compared to non-authenticated users.

This can be acheived by marking a route with an additional attribute: `x-passThruWithoutJWT`

This will pass the request through to the domain with or without a jwt, but it also allows the domain to check if a decoded token has been passed or not. Invalid tokens will result in an unauthenticated response from the route and not hit the domain. The output will also pass the JwtAccess to the domain with `| undefined` making it very clear within the domain that the decoded jwt may or may not be there:
```typescript
  public async weatherIdGet(
    jwtData: JwtAccess | undefined,
    path: WeatherIdGetPath
  ): Promise<WeatherFull> {
    // check jwtData and react accordingly
  }
```


#### Input/ouput filters
The [**input**](https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/http/nodegen/routes/___op.ts.njk#L29) is protected by the npm package [celebrate](https://www.npmjs.com/package/celebrate). Anything not declared in the request by the swagger file will simply result in a 422 error being passed back to the client and will not hit the domain layer.

The [**output**](https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/http/nodegen/routes/___op.ts.njk#L33) is protected by the npm package [object-reduce-by-map](https://www.npmjs.com/package/object-reduce-by-map) which strips out any content from an object or array, or array of objects that should not be there.

Both the input and output are provided the request and response object, respectively, from the api file. 

This means that once in the domain layer you can be safe to think that there is no additional content in the request object than that specified in the swagger file.

Conversely as the output is reduced, should a domain accidentally return attributes it shouldn't they will never be passed back out to the client.

#### Permission helper
`src/http/nodegen/routes/___op.ts.njk` will look for the `x-permission` attribute within a path object eg:
```
x-permission: adminUsersDelete
```
It will then [inject the permission middleware](https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/http/nodegen/routes/___op.ts.njk#L28) to the give path and pass the said middleware the provided permission string. In the above case, "adminUserDelete" will be passed.

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

The `NodegenRequest` interface is [provided by these templates](https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/http/nodegen/interfaces/NodegenRequest.ts) out of the box so nothing extra required (a domain gets a full req object based on the [core feature](https://acrontum.github.io/openapi-nodegen/#/_pages/features?id=pass-full-request-object-to-___stub-method)). This interface extends the express request interface with the additional attributes added by this setup.

The `JwtAccess` interface is not provided, it expects that you have in your api file a definition by this name. You can see an example in the core: [example JwtAccess interface](https://github.com/acrontum/openapi-nodegen/blob/develop/test_swagger.yml#L176). If you want to use a different interface name, change the value of "jwtType", if you don't want it at all, just delete it from your `.nodegenrc` file.

#### Access validation service
Within the nodegen folder there is a middlware `accessTokenMiddleware.ts` injected into the routes when a security attribute is found in the api path.

This middleware passes the details onto the provided AccessTokenService: `AccessTokenService.validateRequest(req, res, next, headerNames)`

The entry method is given an array of strings, eg for a route requiring either jwt or api key it might be: `['authorisation','api-key']'`. This is enough information to then validate the values of the said header thus validating the request.

Out of the box it is quite simple and it is expected that you inspect and update this service to fit the needs of your app.

#### Caching
The middleware `src/http/nodegen/middleware/headersCaching.ts` is a proxy function to `HttpHeadersCacheService`.

This allows you to control the cache headers returned. Alternatively you may wish to inject your own caching service logic here as you have full access to the request and response object.

#### Errors
However nice all the automated layer is, once in the domain method it is common to want to throw some http error codes from the domain. Each of the error [helpers here](https://github.com/acrontum/openapi-nodegen-typescript-server/tree/master/src/http/nodegen/errors) have their own handle [middleware](https://github.com/acrontum/openapi-nodegen-typescript-server/tree/master/src/http/nodegen/middleware). For more info on each take a read of the comments within the files.

## Setup
In a new directory run: `npm init`

Add to the dev dependencies openapi-nodegen
 - run: `npm i --save-dev openapi-nodegen`

Add the nodegen generate the server to the package.json scripts object. The following will load a local swagger file api.1.0.0.yml and generate the server with the given git repository:
```
  "scripts": {
      "generate:nodegen": "openapi-nodegen ./api_1.0.0.yml -t https://github.com/acrontum/openapi-nodegen-typescript-server.git",
```

#### Tip 1 local api file pointer
Typically the generation is only done during development. Typically you would orchestrate a full spec file from many little files then build 1 file to share to both openapi-nodegen and things like AWS or other gateways. To make life easier, you can simply point openapi-nodegen to the working directory of your api file repo, instead of manually copying the built file:
 ```
   "scripts": {
       "generate:nodegen": "openapi-nodegen ../auth-api-d/built/api_1.0.0.yml -t https://github.com/acrontum/openapi-nodegen-typescript-server.git",
 ```

#### Tip 2 for older versions of openapi-nodegen

Reference a tag:
```
  "scripts": {
      "generate:nodegen": "openapi-nodegen ./swagger/api_1.0.0.yml -t https://github.com/acrontum/openapi-nodegen-typescript-server.git#3.0.6",
```
