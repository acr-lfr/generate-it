import { Request, Response } from 'express';

import {{camelCase operation_name}}Domain from '../../../domains/{{capitaLetter operation_name}}Domain';
import {{camelCase operation_name}}Transformer from '../transformers/{{capitaLetter operation_name}}Transformer';

class {{capitaLetter operation_name}}Controller {
{{#each operation}}
  {{#each this.path}}
    {{#validMethod @key}}
async {{../operationId}} (req: Request, res: Response) {
  return res.json(
    {{camelCase ../../../operation_name}}Transformer.{{../operationId}}(
      await {{camelCase ../../../operation_name}}Domain.{{../operationId}}({{pathParamsToDomainParams ../parameters withPrefix="true"}})
    )
  );
}
    {{/validMethod}}
  {{/each}}
  {{#if @last}}
}
{{else}}

{{/if}}
{{/each}}

export default new {{capitaLetter operation_name}}Controller();
