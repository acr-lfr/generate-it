# OpenAPI Nodegen
[![Build Status](https://travis-ci.org/acrontum/openapi-nodegen.svg?branch=master)](https://travis-ci.org/acrontum/openapi-nodegen)

OpenAPI Nodegen is a tool to generate RESTful servers and clients without a dependency on Java.

Example using the pre-made Typescript ExpressJS Server templates:
```
openapi-nodegen apifile.yml --template https://github.com/acrontum/openapi-nodegen-typescript-server.git
```

___

Full [documentation](https://acrontum.github.io/openapi-nodegen/) hosted on github pages..

___

The client/server will be generated using the [Nunjucks Template](https://www.npmjs.com/package/nunjucks) engine, which is a port of [jinja2](http://jinja.pocoo.org).

The templates should be hosted on a publicly available https url, eg: [openapi-nodegen-typescript-server](https://github.com/acrontum/openapi-nodegen-typescript-server#setup). 

It is strongly recommended to use the OpenApi DSL package [boats](https://www.npmjs.com/package/boats) to standardize OpenAPI file architecture and operation IDs.

As this project evolves is is important to ensure backward compatibility is possible, major releases offer new functionality but potential breaking changes to existing template repos. From openapi-nodegen v3.0.6 onward it is possible to fetch a template by tag or branch, for example if your server was built using v3.0.6 & you do not have the time to upgrade you would run the above with the tag (assuming the author of the tpl repo has added tags or branches):
```
openapi-nodegen apifile.yml -t https://github.com/acrontum/openapi-nodegen-typescript-server.git#3.0.6
```

___

OpenAPI Nodegen is an opensourced project from [acrontum](https://www.acrontum.de/) written in TypeScript and is tested on NodeJS 12 LTS. 
