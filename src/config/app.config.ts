// Filename: app.config.ts
// basic configuration parameters for the application

import getLocalIPAddress from '../utils/getLocalIPAddress.js';

const PORT = 3000;

export const config = {
  name: 'Simple Task Manager',
  abbreviation: 'STM',
  port: PORT,
  baseUrl: `http://${getLocalIPAddress()}:${PORT}`,
};
