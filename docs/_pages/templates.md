An example .nodegenrc configuration file including all the available variables can be seen on the [Configuration page](configuration.md).

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

Named: ___op.ts.njk

This type of file is rewritten every single time the core is run. In the example above it is used as a route file for the nodejs server.

The `___op.ts.njk` files generally live in the `nodegenDir` of the folder structure.

### INTERFACE

Named: ___interface.ts.njk

This type of file is rewritten every single time the core is run, it only ever contains interface code, currently only for typescript files.

The `___interface.ts.njk` files generally live in the `nodegenDir` of the folder structure.

### MOCK

Named: ___mock.ts.njk

This type of file is rewritten every single time the core is run.

The `___mock.ts.njk` files live in the `nodegenMockDir` of the folder structure.

### STUB

Named: ___stub.ts.njk

The stub is as the name suggests a file intended to house stubbed methods. These are designed to be method/function placeholders for the developer to write in the business logic that is not possible to generate.

### EVAL

Named: ___eval.ts

When generate-it encounters an eval file, it will import in and run it's default export - any file generation or modification is completely handed over, but afterwards the file is deleted.

Useful if you need something that is not supported natively, or would be cumbersome to do through templating. The default export of the file will be passed in a [Context](https://github.com/acr-lfr/generate-it-typescript-server/blob/9443ef670705eb6637991bc93cba9ebb619c7233/src/http/nodegen/tests/___eval.ts#L8) as the first argument, containing most of the generation data.

### EXAMPLE

Named: [EXAMPLE_anything.ts](https://github.com/acr-lfr/generate-it/blob/master/test_server/.openapi-nodegen/git/httpsGithubComAcrontumOpenapiNodegenTypescriptServerGit/src/EXAMPLE_app.ts)

On the 1st generation of an API these files will be copied over. After the 1st run, these files in the remote TPL repo will be ignored.

Useful for when you want to easily manage and add example database repository files, or connections files to other systems.

The user is free to delete these files are the 1st run knowing they will not reappear.

NOTE: This is different to type OTHER which will always be added back if not found.


### OTHER

Named: Anything, with or without .njk file extension.

These files are every other file that is not one of the above special file types. They are also rendered by the templating engine unless the `renderOnlyExt` option is enabled.

### Testing template files

Generate-it will ignore any files in a folder called "\_tpl_testing\_". 

This allows the developer of the template to build and test locally before publishing.
