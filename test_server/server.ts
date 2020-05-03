import config from './src/config';
import 'openapi-nodegen-logger';

import app from './src/app';
import appCli from './src/app.cli';

const PORT = appCli().port || config.port;

// Start listening for incoming HTTP requests
app.listen(PORT, () => {
  console.log('server listening on port: ' + PORT);
});
