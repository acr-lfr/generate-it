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
  "joi": {
    "strings": {
      "autotrim": "opt-out"
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
| ignoreFiles      | string or string[]  | ['\\.idea', '\\.git', '\\.vscode', 'node_modules', 'build', 'dist']    | "ignoreFiles": ["target"] | If specified, ignores files matching the pattern or list (eg binaries, build outputs, etc). Values are parsed as regular expressions                                                                                                                           |
| renderOnlyExt    | string              | '*'     | "renderOnlyExt": ".njk"                                      | If specified, will only render files with the extension provided and simply copy everything else.                                                                                                                                                                                        |
| dontPrettify     | boolean             | false   | "dontPrettify": true                                         | If true, prevents running `prettier` on files after rendering.                                                                                                                                                                                                                           |
| quickTypeOptions | Record<string, any> | {}      | "quickTypeOptions": { "prefer-unions": true }                                              | Specifies additional options for QuickType when converting schemas to types |
| typegen          | string              | ''                                                                     | "./schema-to-typescript.js" | Allows you to specify your own schema to types generator. In case nothing is specified here, the default type generator (QuickType) will be used instead |

The full contents of the nodegenrc file are passed to the templates within the config: [TemplateVariables.ts](https://github.com/acr-lfr/generate-it/blob/master/src/interfaces/TemplateVariables.ts)

### Joi rc details
From the nodegenrc file you have the option to set autotrim on incoming strings to your API

When not passed, auto-trim is off. The available options to pass in are "off", "opt-in" or "always".

- `off` means the auto-trim will never be applied.
- `opt-out` means the auto-trim will be applied unless the specific schema contains `x-dont-trim`.
- `always` means the auto-trim will always be applied to all incoming string data types.

If you have `opt-out` set for your api, opt'ing out on a single component is done by adding the `x-dont-trim` option to your schema eg:
```yaml
book-blurb:
  type: string
  x-dont-trim: true
```

If you only want `trim` input on a few routes, please the see "Joi validation & transformation" section in the template functions guide. You would need to apply the trim Joi method on your specific component.


### TYPEGEN EXAMPLE

**./schema-to-typescript.js:**
```js
module.exports.default = async (
  name,
  schema,
  config
) => {
  const typeString = doSomeMagicToGetTypesFromSchema(schema);

  return {
    outputString: `export type ${name} = ${typeString};\n`
  };
};
```
