# OpenAPI Nodegen
[![Dependencies](https://david-dm.org/acrontum/openapi-nodegen.svg)](https://david-dm.org/acrontum/openapi-nodegen) | [![Build Status](https://travis-ci.org/acrontum/openapi-nodegen.svg?branch=master)](https://travis-ci.org/acrontum/openapi-nodegen) | [codecov](https://codecov.io/gh/acrontum/openapi-nodegen/)

OpenAPI Nodegen is a tool to generate RESTful servers and clients without a dependency on Java with a file-system allowing for constant regeneration of a HTTP layer without affect the business logic of the app.

Here is an example use the pre-made Typescript ExpressJS Server templates c/w ts interfaces:
```
openapi-nodegen apifile.yml --template https://github.com/acrontum/openapi-nodegen-typescript-server.git
```

___

Full [documentation](https://acrontum.github.io/openapi-nodegen/) hosted on github pages..

___

The client/server will be generated using the [Nunjucks Template](https://www.npmjs.com/package/nunjucks) engine.

The templates should be hosted on a publicly available https url, eg: [openapi-nodegen-typescript-server](https://github.com/acrontum/openapi-nodegen-typescript-server#setup). 

It is strongly recommended to use the OpenApi DSL package [boats](https://www.npmjs.com/package/boats) to standardize OpenAPI file architecture and operation IDs.
___

OpenAPI Nodegen is an opensourced project from [acrontum](https://www.acrontum.de/) written in TypeScript and is tested on NodeJS 12 LTS. 
