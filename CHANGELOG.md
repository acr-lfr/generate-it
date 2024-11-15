# Changelog

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

