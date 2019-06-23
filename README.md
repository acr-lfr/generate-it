# OpenAPI Nodegen

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Introduction](#introduction)
- [Roadmap](#roadmap)
- [Installation](#installation)
- [cli options](#cli-options)
- [Additional tips and tricks](#additional-tips-and-tricks)
    - [Avoiding overwriting previously written changes](#avoiding-overwriting-previously-written-changes)
    - [Usage of security definitions combined with middlewares](#usage-of-security-definitions-combined-with-middlewares)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction
OpenAPI Nodegen generates a NodeJS REST API with ExpressJS based on the OpenAPI file that you provide it. Please [see the templates](https://github.com/acrontum/openapi-nodegen/tree/master/templates/es6) for the structure it will use.

By default the domain layer is generated as stub methods awaiting your input, passing the `--mocked` option will generate `domain/__mocks_/<domain mock>` files and referenced in the domain methods, meaning you are capable of generating a mock server based on your OpenAPI file in seconds and then gradually replace the mocked output with real business logic.

After initial generation, the domain layer is not touched should the respective file already exist.

OpenAPI Nodegen uses the [Nunjucks Template](https://www.npmjs.com/package/nunjucks) engine (an engine which is a port of [jinja2](http://jinja.pocoo.org))

It is heavily advised to use [boats](https://www.npmjs.com/package/boats) to standardise your OpenAPI file architecture and operation ids.

## Roadmap
- Ensure this package can be used for oa3 files, currently the block is on the generation of the celebrate validation layer, not a big issue to resolve but in oa3 everything is pretty much in a schema block in the request parameters which is a breaking change from oa2. 
- Add docker ability to both es6 and ts templates.
- Update the Typescript templates to use Nunjucks over moustache. They are currently 100% broken awaiting the port over.
- Make the mock generators more intelligent, instead of "dumb" random text responses return "testable" content.
- Convert the mock generators to the typescript tpl.
- Optionally add in socket connections via vli args.
- Optionally add in mongoose via cli args.


## Installation
Install as a local devDependency:
```
npm i --save-dev openapi-nodegen
```

Add a package json script (where your OpenAPI file lives at the same level as the `package.json`)
```
"scripts": {
    "generate:nodegen": "openapi-nodegen ./openapi.yml -m",
}
```

## cli options
```
  Usage: cli <swaggerFile> [options] 
  Options:

    -V, --version                           output the version number
    -m, --mocked                            If passed, the domains will be configured to return dummy content.
    -o, --output <outputDir>                directory where to put the generated files (defaults to current directory) (default: /home/carmichael/code/open-source-projects/openapi-nodegen)
    -t, --template <template>               template to use (es6 or typescript) (default: es6)
    -i, --ignored-modules <ignoredModules>  ignore the following type of modules (routes, controllers, domains, validators, transformers) in case they already exist (separated by commas)
    -h, --help                              output usage informati
```

## Additional tips and tricks

#### Avoiding overwriting previously written changes
When trying to generate a server on top of a previously generated server, you need to take into account that all the files
inside `src/http/nodegen` are going to be overwritten.
If you are interested in creating a custom middleware, please make sure to place it outside `src/http/nodegen`, and use the `middlewaresImporter.js` (which is not going to be overwritten) to import it.

#### Usage of security definitions combined with middlewares
In addition to routes, controllers, transformers, and validators, the Nodegen also generates a few middlewares that you would most likely like to use in case you wanna protect some of yours routes with an `API key` / `JWT token`.
To help the Nodegen understanding which security definitions are API keys and which are JWT tokens, you will need to give them one of the following names `apiKeyX` / `jwtTokenX` (the X can be replaced with any other character).
An example of an API key security definition:

```yaml
securityDefinitions:
  apiKey1:
    type: apiKey
    in: header
    name: 'x-api-key'
```

And an example of a JWT token security definition:
```yaml
securityDefinitions:
  jwtToken1:
    type: apiKey
    in: header
    name: 'Authorization'
```
