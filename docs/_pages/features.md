## Fetch remote templates
```
  -t, --template <url>                  Full URL to a public git repo, eg github
```
A required [command line](/_pages/cli.md) argument.

All the template files to generate content are not in the core. The core downloads the template files from a git URL, eg from GitHub, of your choice.

To run the OpenAPI Nodegen it requires a valid git [template URL](/_pages/known-templates.md).

The core will `git clone` or `git pull` the given url. 

#### Targeted template version/tag fetch
To help ensure backward compatibility of future releases of the core and the templates it is possible to instruct the core to fetch a specific tag or branch of a git repository. This allows templates to be tagged for specific releases of the core.

> This was released on version 3.0.6

Targeting is handled using the same pattern seen with NPM via a trailing *#<version|branch>*
```
generate-it apifile.yml -t https://github.com/acr-lfr/generate-it-typescript-server#3.0.6
```

###### Example
With the release of version 4.0.0 of the core it brought with it the use of a 3rd party library to generate the content of the interfaces: [quicktype](https://www.npmjs.com/package/quicktype). Quicktype helped ensure better interface generation but introduced a breaking change to the interface files which required a new version of the TypeScript server template files to be released.  To ensure servers and clients built with the version 3 of the core would not pickup the new changes in version 4 of the templates; it was required that the core could pick a specific tag or branch of a tpl rgit repo.

The caveat of course is that the authors of the templates must ensure to tag their template repositories to allow this feature to operate.
Without the targeted tag/branch the default branch will be used and subsequent generations will automatically run git pull to fetch the latest changes.


#### Bypass template fetch
```
  --dont-update-tpl-cache
```
A [command line](/_pages/cli.md) argument option.

By default OpenAPI Nodegen will run a git pull on each new generation. Passing in this flag will prevent this from happening which is handy when working without internet connection.

It is required that the 1st run is done with an internet connection, this flag will subsequently just use the cached tpl file generated.

## Stub (domain) versions
The core will store the last few versions of stub files generated in a cache folder to compare future changes:
```
.generate-it/cache/compare
```

During the 1st generation this folder is populated. Subsequent generations will compare the previous files to the current generation, any difference are then printed to the console.

This allows a developer to see when and where they should make changes to their domain layer, eg new request params or method renaming. To allow other developers in a team to make use of this comparison history you would want to keep the comparison files in git.

#### Turn the comparison off
```
--dont-run-comparison-tool
```
A [command line](/_pages/cli.md) argument option when passed will not run the comparison.

If you are working alone and don't like to see too much output in the console all the time use this flag to turn the comparison tool off.

## Nested stub files - aka nested domains
The default config will result in each stub file named after the 1st URL segment, each domain then houses a method representing each HTTP verb under this 1st segment no matter how nested.
Over time an API can get begin to hold a lot of routes resulting in the said class files containing many methods which is cumbersome to maintain. 

#### segmentFirstGrouping
It is possible to break a domain down into 2 with the `segmentFirstGrouping: <number>` directive in the rc file or via `--segment-first-grouping <number>` passed as a command line argument.

The net result will be to group all methods up to nth segement in 1 domain and the rest in the 2nd.

Example:
```
{
  "nodegenDir": "src/http/nodegen",
  "nodegenMockDir": "src/domains/__mocks__",
  "nodegenType": "server",
  "segmentFirstGrouping": 2,
  "helpers": {
    "stub": {
      "jwtType": "JwtAccess",
      "requestType": "NodegenRequest"
    }
  }
}
```

With GET routes for the following paths:
```
GET /item/
GET /item/{id}
GET /item/{id}/comment
GET /item/{id}/comment/{commentId}
GET /item/{id}/comment/{commentId}/like
GET /item/{id}/photo
GET /item/{id}/photo/{photoId}

GET /user/
GET /user/{id}
GET /user/{id}/settings
```

Will result in the following domain files:
```
ItemDomain.ts
ItemCommentDomain.ts
ItemPhotoDomain.ts
UserDomain.ts
UserSettingsDomain.ts
```

It is advisable to generate your API 1st using the cli arg `--segment-first-grouping <number>` then retain the setting in the .nodegenrc as illustrated above.

#### segmentSecondGrouping
It is possible to break down the domain files further by use of the `segmentSecondGrouping`. This feature can only be used if the `segmentFirstGrouping` is also set.
The `segmentSecondGrouping` expects a number greater that the 1st grouping and is relative to the whole path.

Example:
```
{
  ...
  "segmentFirstGrouping": 2,
  "segmentSecondGrouping": 4,
  ...
}
```

This path:
```
GET /item/{id}/comment/{commentId}/like
```

Would result in a domain of:
```
ItemCommentLike
```

## Mocked responses
```
  -m, --mocked       If passed, the domains will be configured to return dummy content.
```
A [command line](/_pages/cli.md) argument option.

Based on the definition of the responses in the swagger/openapi file automatically return mocked responses from a generated API with the [generate-it-mockers](https://www.npmjs.com/package/generate-it-mockers) package.

The [generate-it-typescript-server](https://github.com/acr-lfr/generate-it-typescript-server/) use of the `--mocked` flag to injected generate-it-mockers into the [domain methods](https://github.com/acr-lfr/generate-it-typescript-server/blob/master/src/domains/___stub.ts.njk#L19). This allows a team to design an API first, setup a microservice quickly to deliver mocked data thus allowing the frontend dev(s) and backend dev(s) to then build without depending on each other.

## Pass full request / response object to \_\_\_stub method

Occasionally you will find that you just want to pass the full request object to the \_\_\_stub file method.

For example, in the typescript server it is sometimes needed that you have the full request object passed to a domain method.

This is done by adding an attribute to the swagger/openapi path object:
```
x-passRequest: true
```
EG:
```
/pets:
get:
  summary: List all pets
  operationId: petsGet
  tags:
    - pets
  responses:
    "200":
      description: A paged array of pets
      schema:
        $ref: '#/definitions/Pets'
  x-passRequest: true        
```

`x-passResponse` works the same way, but provides the express response object. **NOTE** you must manually complete the response (eg `res.json({ hello: 'world' })`), otherwise your HTTP call will hang.  

#### Allow non authenticated request to access domain
With some API designs there is the need to offer 1 API route which returns content for authenticated users and non-authenticated users. The content could be a newsfeed for example with authenticated users getting a extra attributes in the new objects returned compared to non-authenticated users.

This can be acheived by marking a route with an additional attribute: `x-passThruWithoutJWT`

The result of this feature is `pathParamsToDomainParams` tpl helper will pass the forced type (.nodegenrc: `helpers.stub.jwtType`) as `| undefined` which is seen in the [typescript server](https://github.com/acr-lfr/generate-it-typescript-server#allow-non-authenticated-request-to-access-domain).


## Access all path attributes 

The full path object from the API spec file is passed to the [templates](/_pages/templates.md) where-in they create bespoke function for the servers and clients they produce.

Each set of templates will evolve their own specific attribute requirements. Additional attributes must be prefixed with `x-` to be seen as valid swagger/openapi.

An example of a template specific custom attribute usage: https://github.com/acr-lfr/generate-it-typescript-server/blob/master/src/http/nodegen/routes/___op.ts.njk#L28

## Overriding template code with code from another source

Sometimes, the code of 1 template is ok, but you would like to change just a few lines somewhere in a managed folder.

With injections this is possible.

For example, you might generate a typescript server from [acr-lfr/generate-it-typescript-server](https://github.com/acr-lfr/generate-it-typescript-server) but would like change part of the [src/http/index.ts](https://github.com/acr-lfr/generate-it-typescript-server/blob/master/src/http/index.ts)
```
"injections": [
  {
    "source": "https://github.com/yourusername/ts-overwrites"
  }
],
```

With the above injection block, generate-it will clone the base template and then copy over all files from `yourusername/ts-overwrites` before generating any code. The end result would be a generation based on a merged set of files from the base and your injections. 


## .nodegenrc file
For more details please read this page: [templates](/_pages/templates.md)




