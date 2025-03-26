// Filename: server.ts
// starts Express server

import app from './app.js';
import { baseUrl } from './app.js';
import { config } from './config/app.config.js';

// start server
app.listen(config.port, () => {
  console.log(`[${config.abbreviation}] ${config.name} running at ${baseUrl}`);
});
