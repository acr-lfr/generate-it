# Changelog

### 5.62.1 04/03/2025
fix: _tpl_testing_ ignore split out into copy and render ignore patterns

### 5.62.0 04/03/2025
feat: _tpl_testing_ added to the default ignore allowing a tpl to hold own test files

### 5.61.0 15/02/2025
chore: typescript bumped to latest major and quicktype to latest minor in the 15 major range

### 5.60.0 23/01/2025
feat: when the body is `type: object` without props the Joi validation will now be Joi.any() - essentially no validation and anything send use case for example being incoming webhooks from 3rd party with unknown payload. 

### 5.59.0 12/01/2024
revert: 5.57.0 

### 5.58.0 12/01/2024
unpublished version

### 5.57.0 15/11/2024
fix: allof fixed for deeply nested allOfs - was previously dropping some required fields.
chore: @apidevtools/json-schema-ref-parser upgraded from json-schema-ref-parser

### 5.56.0 12/08/2024
feat: Now allows enums on type number and integer

### 5.55.0 17/01/2024
feat: Input validation and transformation via `x-joi-<method name>` in a openapi schema. Docs [Joi methods exposed](https://acr-lfr.github.io/generate-it/#/_pages/template-functions?id=joi-validation-amp-transformation)

feat: Auto trim strings config (default is off). Docs [auto trim](https://acr-lfr.github.io/generate-it/#/_pages/configuration?id=nodegenrc-joi-configuration)

### 5.54.1 08/01/2024
fix: Nested objects sometimes resulted in required fields being dropped in the input validation of Joi.

