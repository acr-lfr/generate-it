import Joi from 'joi';

export default {
  {{#each operation}}
    {{#each this.path}}
      {{#validMethod @key}}
  {{../operationId}}: {
{{paramsValidation ../parameters}}
  },
      {{/validMethod}}
    {{/each}}
  {{/each}}
};

