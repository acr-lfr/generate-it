# Generate-It
[![Dependencies](https://david-dm.org/acrontum/generate-it.svg)](https://david-dm.org/acrontum/generate-it) | [![Build Status](https://travis-ci.org/acrontum/generate-it.svg?branch=master)](https://travis-ci.org/acrontum/generate-it) | [codecov](https://codecov.io/gh/acrontum/generate-it/)

Generate-It is a tool to generate RESTful servers/clients without Java.

Change your APIs yml and simply (re)Generate-It, your business logic is safe and sound.. but the http layer is regenerated in seconds.

Here is an example: generate-it is parsing an openapi file using a [typescript sever tpl git repo](https://github.com/acrontum/openapi-nodegen-typescript-server) (checkout the gihub page to see the structure of the generated code):
```
generate-it openapi.yml --template https://github.com/acrontum/openapi-nodegen-typescript-server.git
```

> This tool used to be called `openapi-nodegen`

> coming soon async-api support for event based architecture, eg sockets and rabbit-mq

___

Full [documentation](https://acrontum.github.io/generate-it/) hosted on github pages..

___

The client/server will be generated using the [Nunjucks Template](https://www.npmjs.com/package/nunjucks) engine.

The templates should be hosted on a publicly available https url, eg: [openapi-nodegen-typescript-server](https://github.com/acrontum/openapi-nodegen-typescript-server#setup). 

It is strongly recommended to use the OpenApi DSL package [boats](https://www.npmjs.com/package/boats) to standardize OpenAPI/AsyncAPI file architecture and operation IDs and more.
___

Generate-It is an opensourced project from [acrontum](https://www.acrontum.de/) written in TypeScript and is tested on NodeJS 12 LTS. 
