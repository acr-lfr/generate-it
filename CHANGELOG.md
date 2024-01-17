# Changelog

### 5.55.0 17/01/2024
feat: (see Joi in the template docs) Schema's can now use [Joi methods](https://joi.dev/api/) (validation and transformation) by adding `x-joi-<method name>` with the value passed as the param to the method being called

feat: (see Configuration in docs) Nodegerc Joi config option to auto-trim strings on input. Options are `off` | `opt-out`. Default is `off` & the latter is controlled by the component with `x-dont-trim`.

### 5.54.1 08/01/2024
fix: Nested objects sometimes resulted in required fields being dropped in the input validation of Joi. 

