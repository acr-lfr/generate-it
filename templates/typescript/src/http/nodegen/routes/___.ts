import { Router } from 'express';
const validate = require('express-validation');

import jwtMiddleware from '../middleware/jwtMiddleware'
import apiKeyMiddleware from '../middleware/apiKeyMiddleware';

import {{camelCase operation_name}}Controller from'../controllers/{{capitaLetter operation_name}}Controller';
import {{camelCase operation_name}}Validators from'../validators/{{prettifyRouteName operation_name}}Validators';

export default function() {
const router = Router({});

{{#each operation}}
  {{#each this.path}}
    {{#validMethod @key}}
router.{{@key}}('{{../../subresource}}',{{getSecDefMiddleware .. secDefs=../../../swagger/securityDefinitions}} validate({{camelCase ../../../operation_name}}Validators.{{../operationId}}), {{camelCase ../../../operation_name}}Controller.{{../operationId}});
    {{/validMethod}}
  {{/each}}
  {{#if @last}}
  
  return router
  {{/if}}
{{/each}}
};
