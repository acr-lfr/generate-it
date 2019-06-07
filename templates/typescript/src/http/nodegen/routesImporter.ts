import express from 'express';

{{#each @root.swagger.endpoints}}
{{#endsWith @root.swagger.basePath '/'}}
import {{prettifyRouteName ..}}Routes from './routes/{{prettifyRouteName ..}}Routes';
{{else}}
import {{prettifyRouteName ..}}Routes from './routes/{{prettifyRouteName ..}}Routes';
{{/endsWith}}
{{/each}}
import swaggerRoutes from './routes/swaggerRoutes';

export default (app: express.Application) => {
  {{#each @root.swagger.endpoints}}
  {{#endsWith @root.swagger.basePath '/'}}
  app.use('{{@root.swagger.basePath}}{{..}}', {{prettifyRouteName ..}}Routes());
  {{else}}
  app.use('{{@root.swagger.basePath}}/{{..}}', {{prettifyRouteName ..}}Routes());
  {{/endsWith}}
  {{/each}}
  {{#endsWith @root.swagger.basePath '/'}}
  app.use('{{@root.swagger.basePath}}swagger', swaggerRoutes());
  {{else}}
  app.use('{{@root.swagger.basePath}}/swagger', swaggerRoutes());
  {{/endsWith}}
};
