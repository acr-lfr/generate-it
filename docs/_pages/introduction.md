[![Dependencies](https://david-dm.org/acrontum/generate-it.svg)](https://david-dm.org/acrontum/generate-it) | [![Build Status](https://travis-ci.org/acrontum/generate-it.svg?branch=master)](https://travis-ci.org/acrontum/generate-it) | [codecov](https://codecov.io/gh/acrontum/generate-it/)

# Generate-It

Generate-It is an open-sourced tool from [https://www.acrontum.com](https://www.acrontum.com) and [https://www.liffery.com](https://www.liffery.com).

Automate the donkey work of manually typing out the HTTP layers APIs and maintaining them by hand! Automatically generate code from your swagger, openapi or asynapi files!

Build your complex yaml files from [boats](https://www.npmjs.com/package/boats) to speed things up further!

## Introduction

Write a well defined RESTful API specification file for server or client (eg with [BOATS](https://www.npmjs.com/package/boats)) then [Generate-It](https://www.npmjs.com/package/generate-it). 

Checkout the known-template page to see what can be built.

Generate-it is very similar to swagger-codegen except:
- The core engine is written 100% in TypeScript and only needs Node LTS to run and is currently designed to primarily generate TypeScript code.
- The template engine is the Mozilla Nunjucks engine extended with Lodash & a few custom helpers.
- All the template files to generate content have been removed from the core engine.
  - The core downloads the template files from a git URL, eg from GitHub, of your choosing.
  - This allows for tpl changes to be released without having to publish a new version of the core.
