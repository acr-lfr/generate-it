# OpenAPI Nodegen
[![Build Status](https://travis-ci.org/acrontum/openapi-nodegen.svg?branch=master)](https://travis-ci.org/acrontum/openapi-nodegen)

OpenAPI Nodegen is a tool which to generate RESTful servers and clients without a dependency on Java.

The client/server will be generated using the [Nunjucks Template](https://www.npmjs.com/package/nunjucks) engine, which is a port of [jinja2](http://jinja.pocoo.org).

The templates should be hosted on a publicly available https url, eg: [openapi-nodegen-typescript-server](https://github.com/acrontum/openapi-nodegen-typescript-server#setup). This is a new requirement starting with version 3.0.0.

It is strongly recommended to use [boats](https://www.npmjs.com/package/boats) to automatically standardize OpenAPI file architecture and operation IDs.

___

[Click here for the documentation and roadmap](https://acrontum.github.io/openapi-nodegen/).

___

OpenAPI Nodegen is an opensourced project from [acrontum](https://www.acrontum.de/) and requires NodeJS 10+ LTS to run.
