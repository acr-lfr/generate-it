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
.openapi-nodegen/cache/compare
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

Sometimes, the code of 1 template is ok, but you would like to change just a few lines somewhere in a managed folder. With injections this is possible.

### Basic use case

In the scripts of your package.json file:
```
  "scripts": {
    ...
    "generate:server": "generate-it ../my-api.yml -t https://github.com/acr-lfr/generate-it-typescript-server.git",
    ...
  }
```

You would be able to override 1 or more specific files generated by 1st modifying the .nodegenrc file to include:
```
"injections": [
  {
    "source": "https://github.com/yourusername/ts-overwrites"
  }
],
```

Now when regenerating the server with `npm run generate:server` generate-it will:
- Pull any changes into `.openapi-nodegen/git/httpsGithubComAcrontumOpenapiNodegenTypescriptServerGit`
- Read the nodegen rc file and see the injections, so will create a new folder `.openapi-nodegen/git/httpsGithubComAcrontumOpenapiNodegenTypescriptServerGit_merged`
- It will copy into the folder all the base files
- Will then clone the injection url `.openapi-nodegen/gitGithubComYourusernameTs-overwrites` and copy files into the merged folder 1 by 1, overwriting any that may already be there.

### More advanced use

The basic use is perfectly fine for one off overrides, however if you need to do this for every single new api this becomes a chore.

To make this simpler, turn the whole process around.
1. Change the package script file to pull from your `https://github.com/yourusername/ts-overwrites`:
```
  "scripts": {
    ...
    "generate:server": "generate-it ../my-api.yml -t https://github.com/yourusername/ts-overwrites",
    ...
  }
```   
2. In this remote template repo, change the .nodegenrc file to look as follows:
```
{
  "nodegenDir": "src/http",
  "nodegenMockDir": "src/domains/__mocks__",
  "nodegenType": "server",
  "segmentFirstGrouping": 2,
  "segmentSecondGrouping": 4,
  "helpers": {
    "stub": {
      "jwtType": "JwtAccess",
      "requestType": "NodegenRequest"
    }
  },
  "injections": [
     {
        "isBaseTpl": true
        "source": "https://github.com/acr-lfr/generate-it-typescript-server.git"
     }
     {
        "source": "https://github.com/yourusername/ts-overwrites"
     }
   ]
}
```

What will happen now:
1. The package.json script calls generate-it using the remote tpl which contains the above nodegenrc file
2. The existence of the injections object tells generate-it create a new folder which will house the merged contents. In the above example:
   1. generate-it-typescript-server files will be copied into the `.openapi-nodegen/git/<tpl name>_merged` folder 1st, then your override files will automatically be added on top.
   2. The order of the injections array is respected, ergo, the 1st injection object in the array is handled 1st and the 2nd second etc etc until the array is exhausted
   3. In the 1st position there is a boolean flag `isBaseTpl: true`. When this optional flag is present generate it will merge the package.json scripts into 1 using the isBaseTpl's package.json as the base object to merge into.
      - When this boolean flag is not present, nothing is merged. Instead, should the last injection tpl files contain a package.json file, this will replace whatever is found in the merged folder.
      - If you place the boolean on more than 1 injection object an error is thrown.
      - You can mark any injection to be the base.
      - TIP: It is advisable to use this flag as it offsets the dependency management to the authors of the base tpl.
3. The end/final result will be your API now contains a combination of the injection tpls.
   1. The base tpl management can be left to whoever manages it.
   2. You can inject your changes as required and manage updates to the changes remotely, changes will be pulled in on next call of generate-it.

## .nodegenrc file
For more details please read this page: [templates](/_pages/templates.md)




