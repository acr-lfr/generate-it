# OpenAPI Nodegen
OpenAPI Nodegen is a tool which will you generate an ES6 NodeJS Express Server based on the OpenAPI (YML) file that you provide it. 

In addition to the server, you can also stub the domain layer with auto mock generators to get moving fast, use the `--mocked` option.

The server is generated using the [Nunjucks Template](https://www.npmjs.com/package/nunjucks) engine (an engine which is a port of [jinja2](http://jinja.pocoo.org))

It is heavily advised to use [boats](https://www.npmjs.com/package/boats) to automatically standardise openapi file architecture and operation ids.
___

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Roadmap](#roadmap)
- [Example package.json script](#example-packagejson-script)
- [cli options](#cli-options)
- [Installation](#installation)
- [Additional tips and tricks](#additional-tips-and-tricks)
    - [Avoiding overwriting previously written changes](#avoiding-overwriting-previously-written-changes)
    - [Usage of security definitions combined with middlewares](#usage-of-security-definitions-combined-with-middlewares)
- [Example](#example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Roadmap
- Add docker ability to both es6 and ts templates.
- Make the mock generators more intelligent, instead of "dumb" random text responses return "testable" content.
- Ensure this package can be used for oa3 files, currently the block is on the generation of the celebrate validation layer, not a big issue to resolve but in oa3 everything is pretty much in a schema block in the request parameters which is a breaking change from oa2. 
- Update the Typescript templates to use Nunjucks over moustache. They are currently 100% broken awaiting the port over.
- Convert the mock generators to the typescript tpl.
- Optionally add in socket connections via vli args.
- Optionally add in mongoose via cli args.


## Example package.json script
Example use from a package json file:
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

## Installation
Install as a local devDependency:
```
  "devDependencies": {
    "openapi-nodegen": "^2.1.7",
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