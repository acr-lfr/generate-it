## Nunjucks

All files are rendered by using the [nunjucks](https://mozilla.github.io/nunjucks/templating.html) template engine. This means you have full access to all other the Nunjucks built in helper functions; set variables, conditionals, loops etc etc.

## Lodash
To extend the functionality of Nunjucks, [lodash](https://lodash.com/docs/4.17.15) has also been injected into the mix. In this [docker-compose.yml](https://github.com/acr-lfr/generate-it-typescript-server/blob/master/docker-compose.yml#L11) file you can see how to access lodash within a template. 

## generate-it built-in tpl helpers
The core also offers a few additional [helper functions](https://github.com/acr-lfr/generate-it/tree/master/src/lib/template/helpers). Each file is injected as the file is called into the tpl engine.

To see the full data object that was passed to any template called the function `getContext()` for example:
```
{{ getContext() | dump }}
```

## Joi validation & transformation
`src/lib/template/helpers/paramsValidation.ts` is the tpl helper used to auto-generate the Joi validation.

Standard openapi validators such as min/max or required are mapped to the appropriate Joi methods. For instance, when a [schema](https://swagger.io/docs/specification/data-models/data-types/) has `minLength: 5` this will automap to `Joi.string().min(5)`.

#### Addition Joi function
The openapi spec is reasonable, but for extended functionality, the whole Joi API is available via the spec files.

You can read the available Joi methods via their docs: https://joi.dev/api/

The syntax to access any of the Joi methods is:
```yaml
yourAttribute:
  type: <openapi data type>
  x-joi-<joi method>: <joi method options>
  x-joi-<joi method>: <joi method options>
  ... etc etc
```

This schema will be mapped to the following pattern in the code:
```
Joi
   .<type>().<joi method>(<joi method options>)
   ... etc etc
```

Real world example, if you are expecting an email for a given schema, you can now handle most of the transformation and validation in the openapi spec, like this:
```yaml
email:
  type: string
  x-joi-lowercase: 
  x-joi-email:
    allowFullyQualified: true
```
Resulting in (note that no value results in nothing passed to the method):
```
Joi
   .string()
   .lowercase()
   .email({allowFullyQualified: true})
```


## Reveal full context in tpl
By adding `{{ getContext() | dump }}` you will see the full context object passed to a template.

