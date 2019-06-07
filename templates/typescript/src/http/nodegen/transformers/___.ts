import dataTransform from '../../../utils/dataTransform';

class {{capitaLetter operation_name}}Transformer{
{{#each operation}}
  {{#each this.path}}
    {{#validMethod @key}}
{{../operationId}} (data: any) {
  return dataTransform({
    {{#../responses}}{{#200}}{{#schema}}{{#equal type 'array'}}{{#each ../items/properties}}{{@key}}: '{{@key}}',{{#unless @last}}
    {{/unless}}{{/each}}{{else}}{{#each ../properties}}{{@key}}: '{{@key}}',{{#unless @last}}
    {{/unless}}{{/each}}{{/equal}}{{/schema}}{{/200}}{{/../responses}}
  }, data)
}
    {{/validMethod}}
  {{/each}}
  {{#if @last}}
}
{{else}}

{{/if}}
{{/each}}
export default new {{capitaLetter operation_name}}Transformer();
