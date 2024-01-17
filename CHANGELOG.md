# Changelog

### 5.55.0 17/01/2024
feat: (see Joi in the template docs) Schema's can now use Joi methods (validation and transformation) by adding `x-joi-<method name>` with the value passed as the param to the method being called

feat: (see Configuration in docs) Joi remote control. You can now auto-trim strings on input the options are `off` | `opt-out` | `always`. Off & always are obvious, `opt-out` is controlled by the schema: Adding `x-dont-trim` to a schema type string when the rc mode is `opt-out` will mean `trim(true)` will not be applied to specific block/

### 5.54.1 08/01/2024
fix: Nested objects sometimes resulted in required fields being dropped in the input validation of Joi. 

