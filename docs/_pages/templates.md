## .nodegenrc
Every template repository must contain at its root a [.nodegenrc](https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/.nodegenrc) file.

The contents are simple but instruct the core of 3 key aspects:
- Which folder contains the http layer, referred to as the nodegen directory: `nodegenDir`
- Which folder contains the mock files, referred to as the nodegen nodegenMockDir
- What type of output the templates create, `client` or `server`
- File helpers: https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/.nodegenrc#L6

Example:
```json
{
  "nodegenDir": "src/http/nodegen",
  "nodegenMockDir": "src/domains/__mocks__",
  "nodegenType": "server",
  "helpers": {
    "stub": {
      "jwtType": "JwtAccess",
      "requestType": "NodegenRequest",
      "tests": {
        "outDir": "src/domains/__tests__"
      }
    }
  }
}
```
### Other options
| Option        | Type               | Example                 | Comment                                                                                                                                                                                                                                                        |
|---------------|--------------------|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ignoreFiles   | string or string[] | ignoreFiles: ['target'] | Allows the template to define which files shouldn't be copied. This String will be treated as a Regex object.<br><br>You could use this option to ignore files and folders that shouldn't be part of the project. For example target folder in maven projects. |
| renderOnlyExt | string             | ignoreFiles: '.njk'     | Allows the template to define which files file extension should be rendered.                                                                                                                                                                                   |
| dontPrettify  | boolean            | dontPrettify: true      | Allows the template to define if the generate-it shouldn't run prettier after generate sources.                                                                                                                                                                |

The full contents of the nodegenrc file are passed to the templates within the config: [TemplateVariables.ts](https://github.com/acrontum/openapi-nodegen/blob/master/src/interfaces/TemplateVariables.ts)

## Available file types
There are 5 core types of template file. Each have their own naming pattern and handled slightly differently by the core:
- OPERATION
- INTERFACE
- MOCK
- STUB
- OTHER

All files starting with 3* underscores "`___`" will be generated multiple times for each path in the url section group (operation). All other files are only generated once then never touched again, thus allowing a developer to customise them.

#### OPERATION

Named: [___op.ts.njk](https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/http/nodegen/routes/___op.ts.njk)

This type of file is rewritten every single time the core is run. In the example above it is used as a route file for the nodejs server.

The `___op.ts.njk` files generally live in the `nodegenDir` of the folder structure.

#### INTERFACE

Named: [___interface.ts.njk](https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/http/nodegen/interfaces/___interface.ts.njk)

This type of file is rewritten every single time the core is run, it only ever contains interface code, currently only for typescript files. 

The `___interface.ts.njk` files generally live in the `nodegenDir` of the folder structure.

#### MOCK

Named: [___mock.ts.njk](https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/domains/__mocks__/___mock.ts.njk)

This type of file is rewritten every single time the core is run.

The `___mock.ts.njk` files live in the `nodegenMockDir` of the folder structure.

#### STUB

Named: [___stub.ts.njk](https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/domains/___stub.ts.njk)

The stub is as the name suggests a file intended to house stubbed methods. These are designed to be method/function placeholders for the developer to write in the business logic that is not possible to generate.

#### OTHER

Named: Anything, with or without .njk file extension.

These files are every other file that is not one of the above special file types. They are also rendered by the templating engine.

