## .nodegenrc
Every template repository must contain at its root a [.nodegenrc](https://github.com/acr-lfr/generate-it-typescript-server/blob/master/.nodegenrc) file.

The contents are simple but instruct the core of 3 key aspects:
- Which folder contains the http layer, referred to as the nodegen directory: `nodegenDir`
- Which folder contains the mock files, referred to as the nodegen nodegenMockDir
- What type of output the templates create, `client` or `server`
- File helpers: https://github.com/acr-lfr/generate-it-typescript-server/blob/9443ef670705eb6637991bc93cba9ebb619c7233/.nodegenrc#L7


The full interface can be found at [src/interfaces/NodegenRc.ts](https://github.com/acr-lfr/generate-it/blob/master/src/interfaces/NodegenRc.ts)

Minimal example:
```json
{
  "nodegenDir": "src/http",
  "nodegenType": "server"
}
```

More extensive example:
```json
{
  "nodegenDir": "src/http",
  "nodegenMockDir": "src/domains/__mocks__",
  "nodegenType": "server",
  "segmentFirstGrouping": 6,
  "segmentSecondGrouping": 8,
  "ignoreFiles": ["\\.idea", "\\.git", "\\.vscode", "node_modules", "build", "dist"],
  "renderOnlyExt": ".njk",
  "dontPrettify": true,
  "helpers": {
    "stub": {
      "jwtType": "JwtAccess",
      "requestType": "NodegenRequest",
      "requestTypeExtensionPath": "@/interfaces/request.interface"
    },
    "tests": {
      "outDir": "src/domains/__tests__"
    },
    "objectReduceByMapOptions": {
      "allowNullish": true,
      "keepKeys": false,
      "throwErrorOnAlien": false,
      "allowNullishKeys": true
    }
  },
  "quickTypeOptions": {
    "prefer-unions": false
  }
}
```

### Other options

| Option        | Type               | Default                                                                | Example                 | Comment                                                                                                                                                                                                                                                        |
|---------------|--------------------|------------------------------------------------------------------------|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ignoreFiles      | string or string[]  | ['\\.idea', '\\.git', '\\.vscode', 'node_modules', 'build', 'dist']    | ignoreFiles: ['target'] | If specified, ignores files matching the pattern or list (eg binaries, build outputs, etc). Values are parsed as regular expressions                                                                                                                           |
| renderOnlyExt    | string              | '*'     | ignoreFiles: '.njk'                                           | If specified, will only render files with the extension provided and simply copy everything else.                                                                                                                                                                                        |
| dontPrettify     | boolean             | false   | dontPrettify: true                                           | If true, prevents running `prettier` on files after rendering.                                                                                                                                                                                                                           |
| quickTypeOptions | Record<string, any> | {}      | "quickTypeOptions": { "prefer-unions": true }                                              | Specifies additional options for QuickType when converting schemas to types |
| enableNullableWorkaround     | boolean             | false   | enableNullableWorkaround: true                   | If true, enables workaround for nullables not being properly detected in QuickType.                                                                                                                                                                                                                           |

The full contents of the nodegenrc file are passed to the templates within the config: [TemplateVariables.ts](https://github.com/acr-lfr/generate-it/blob/master/src/interfaces/TemplateVariables.ts)

## Available file types

There are 5 core types of template file. Each have their own naming pattern and handled slightly differently by the core:
- OPERATION
- INTERFACE
- MOCK
- STUB
- EVAL
- OTHER

All files starting with 3* underscores "`___`" will be generated multiple times for each path in the url section group (operation). All other files are only generated once then never touched again, thus allowing a developer to customise them.

### OPERATION

Named: [\___op.ts.njk](https://github.com/acr-lfr/generate-it-typescript-server/blob/master/src/http/nodegen/routes/___op.ts.njk)

This type of file is rewritten every single time the core is run. In the example above it is used as a route file for the nodejs server.

The `___op.ts.njk` files generally live in the `nodegenDir` of the folder structure.

### INTERFACE

Named: [\___interface.ts.njk](https://github.com/acr-lfr/generate-it-typescript-server/blob/master/src/http/nodegen/interfaces/___interface.ts.njk)

This type of file is rewritten every single time the core is run, it only ever contains interface code, currently only for typescript files.

The `___interface.ts.njk` files generally live in the `nodegenDir` of the folder structure.

### MOCK

Named: [\___mock.ts.njk](https://github.com/acr-lfr/generate-it-typescript-server/blob/master/src/domains/__mocks__/___mock.ts.njk)

This type of file is rewritten every single time the core is run.

The `___mock.ts.njk` files live in the `nodegenMockDir` of the folder structure.

### STUB

Named: [\___stub.ts.njk](https://github.com/acr-lfr/generate-it-typescript-server/blob/master/src/domains/___stub.ts.njk)

The stub is as the name suggests a file intended to house stubbed methods. These are designed to be method/function placeholders for the developer to write in the business logic that is not possible to generate.

### EVAL

Named: [\___eval.ts](https://github.com/acr-lfr/generate-it-typescript-server/blob/master/src/http/nodegen/tests/___eval.ts)

When generate-it encounters an eval file, it will import in and run it's default export - any file generation or modification is completely handed over, but afterwards the file is deleted.

Useful if you need something that is not supported natively, or would be cumbersome to do through templating. The default export of the file will be passed in a [Context](https://github.com/acr-lfr/generate-it-typescript-server/blob/9443ef670705eb6637991bc93cba9ebb619c7233/src/http/nodegen/tests/___eval.ts#L8) as the first argument, containing most of the generation data.

### OTHER

Named: Anything, with or without .njk file extension.

These files are every other file that is not one of the above special file types. They are also rendered by the templating engine unless the `renderOnlyExt` option is enabled.
