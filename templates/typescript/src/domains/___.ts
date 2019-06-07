class {{capitaLetter operation_name}}Domain {
{{#each operation}}
  {{#each this.path}}
    {{#validMethod @key}}
async {{../operationId}} ({{pathParamsToDomainParams ../parameters type="true"}}) {
  return {}
}
    {{/validMethod}}
  {{/each}}
  {{#if @last}}
}
{{else}}

{{/if}}
{{/each}}

export default new {{capitaLetter operation_name}}Domain();
