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

###### Tip
Create an `___op` file within a folder called context eg, `nodegen/context/___op.json.njk`.

The operation file should only contain `{{ getContext() | dump }}`.

This will give you full visibility to the object passed, all path details, interface texts etc etc.

