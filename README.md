# Generate-It

Generate-It is a tool to generate RESTful servers/clients without Java.

Generate-It is a tool to generate Event Handle layer for servers/clients without Java, eg RabbitMQ.

Change your APIs yml and simply (re)Generate-It, your business logic is safe and sound.. but the http/channel layer is regenerated in seconds.

Here is an example: generate-it is parsing an **OpenAPI** file using a [typescript sever tpl git repo](https://github.com/acr-lfr/generate-it-typescript-server):
```
generate-it openapi.yml --template https://github.com/acr-lfr/generate-it-typescript-server.git
```

Here is an example: generate-it is parsing an **AsyncAPI** file using a [typescript RabbitMQ tpl git repo](https://github.com/acr-lfr/generate-it-asyncapi-rabbitmq) which is designed to work with the TypeScript server:
```
generate-it asyncapi.yml --template https://github.com/acr-lfr/generate-it-asyncapi-rabbitmq.git
```
___

Full **[DOCUMENTATION & Examples](https://acr-lfr.github.io/generate-it)** hosted on GitHub pages.

___

The client/server will be generated using the [Nunjucks Template](https://www.npmjs.com/package/nunjucks) engine.

The templates should be hosted on a publicly available https url, eg: [generate-it-typescript-server](https://github.com/acr-lfr/generate-it-typescript-server#setup). 

It is strongly recommended to use the OpenApi DSL package [boats](https://www.npmjs.com/package/boats) to standardize OpenAPI/AsyncAPI file architecture and operation IDs and more.
___

Generate-It is an opensource project from [acrontum](https://www.acrontum.de/) and [Liffery](https://www.liffery.com/) written in TypeScript and is tested on NodeJS 14 LTS. 
