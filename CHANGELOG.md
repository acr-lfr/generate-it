# Changelog

### 5.63.0 14/07/2026
chore: dependency updates

Fixes:
1. Swallowed render errors — TemplateRenderer.load() no longer catches-and-returns-undefined; FileIterator now logs which template file failed and rethrows instead of .catch(console.error). A bad template now aborts generation with exit 1 instead of printing "Done! ☺" with files missing.
2. Joi generator injection/breakage (SwaggerUtils.ts) — added an escapeSingleQuoted helper applied to enum values, string defaults, and param names; x-joi-* method names must now be valid JS identifiers (invalid ones are skipped with a warning); regex patterns get unescaped / in the body escaped so ^a/b$ emits /^a\/b$/ instead of a broken literal. The escaping runs after the existing delimiter logic, so all six existing prepareRegexPattern behaviors are preserved.
3. commandRun — registered an error handler on the spawned child, so a missing git binary rejects the promise (letting hasGit()'s friendly message work) instead of crashing the process.
4. Absolute -o paths — path.join(cwd, dir) → path.resolve(cwd, dir); also fixes -o ./ being wrongly rejected with -u due to a trailing-separator mismatch.
5. package.json template source — now read from config.targetDir (where generateBaseStructure writes the merged file) instead of process.cwd(). Verified the e2e templates use package.json.njk, so this branch only affects plain-package.json templates — no test churn.
6. Verbose logging — the inverted o === '' guards flipped; -v/--very-verbose actually log now.
7. Path-level non-operation keys — swaggerPathIterator skips summary, description, parameters, servers, $ref via the existing isValidMethod helper instead of crashing on valid specs.
8. Mock serializer — arrayWalkWrite no longer passes its accumulator into nested objectWalkWrite (that duplicated everything built so far inside the braces) and no longer strips closing brackets from trailing nested arrays. The only visible change for previously-working inputs is a cosmetic space ([ { id: → [ {id:), which is why three paramsOutputReducer expectations needed updating — the e2e hash suites passed untouched.
9. Dependency diff off-by-one — the three > 1 guards are now > 0, so a single changed script/dependency is reported and -u acts on it.
10. Typeless object properties — param.schema?.type optional chaining; a property defined only by properties now falls through to the Joi.object({...}) branch (covered by a new test) instead of throwing.

### 5.62.5 01/06/2026
fix: bug in the domains when handling file uploads oa3

### 5.62.4 16/06/2025
fix: default ignore paths for copy and render now explicitly match the build & dist folder only, avoiding accidental matches with similarly named files (e.g., tsconfig.build.json).

### 5.62.3 04/03/2025
fix: template fetch fail message referred toa URL even when local path provided

### 5.62.2 04/03/2025
fix: log removed

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

