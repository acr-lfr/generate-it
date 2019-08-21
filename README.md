# OpenAPI Nodegen
[![Build Status](https://travis-ci.org/acrontum/openapi-nodegen.svg?branch=master)](https://travis-ci.org/acrontum/openapi-nodegen)

OpenAPI Nodegen is a tool which will generate a NodeJS Express Server in es6 or typscript based on the provided OpenAPI (YML) file.

Pass the `--mocked` flag to quickly generate a server that will return mock data based on the Swagger file.

The server will be generated using the [Nunjucks Template](https://www.npmjs.com/package/nunjucks) engine, which is a port of [jinja2](http://jinja.pocoo.org).

It is strongly recommended to use [boats](https://www.npmjs.com/package/boats) to automatically standardize OpenAPI file architecture and operation IDs.

___

[Click here for the documentation and roadmap](https://acrontum.github.io/openapi-nodegen/).

___

OpenAPI Nodegen is an opensourced project from [acrontum](https://www.acrontum.de/) and requires NodeJS 10+ LTS to run.
