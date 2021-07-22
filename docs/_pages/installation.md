## Requirements
- Node 12 LTS
- Linux/Mac/Windows
- Git
  - Without git you cannot fetch the templates.

## Setting up and downloading
A package json file:
```
npm init
```

The [generate-it core](npmjs.com/package/generate-it) should be installed as a as a local devDependency:
```
npm i --save-dev generate-it
```

After installation of the core you will need to decide on what you want to build, a server or client. 
Currently there is a lot of activity on the [generate-it-typescript-server](https://github.com/acrontum/openapi-nodegen-typescript-server) which generates a NodeJS server running express written in TypeScript.

After installing, add a build script to your `package.json` file with the relevant [arguments](/_pages/cli.md):
```
"scripts": {
    "generate:nodegen": "generate-it ./openapi.yml -t https://github.com/acrontum/openapi-nodegen-typescript-server.git",
}
```

> make sure you change the "./openapi.yml" to a path that matches your environment.

## Generation time

Small spec files take around 1-2 seconds, medium spec files (around 35 routes) takes around 4-6 seconds... bigger than that, we've not built any microservices with many more routes than that.
