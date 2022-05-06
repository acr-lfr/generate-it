# Generate-It

Generate-It is an open-sourced tool from [https://www.acrontum.com](https://www.acrontum.com) and [https://www.liffery.com](https://www.liffery.com).

Automate the donkey work of manually typing out the HTTP layers APIs and maintaining them by hand! Automatically generate code from your swagger, openapi or asynapi files!

Build your complex yaml files from [boats](https://www.npmjs.com/package/boats) to speed things up further!

## Introduction

Generate-it is very similar to swagger-codegen except.. it does a lot more and there is no Java code in sight.

Use generate-it with openapi and asyncapi yaml files.

Quick example:
```bash
git clone git@github.com:j-d-carmichael/generate-it-dummy.git
cd generate-it-dummy
npm i
npm run generate:server
```

You now have a complete server complete with input and output validation delivering mocked output based on the types defined in the openapi file.

Try changing the openapi file and see how http layer is automatically updated after a re-run of the `generate:server` script, but note that the files in the domain layer after their 1st generation are not altered again.
