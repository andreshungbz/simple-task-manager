// Filename: getLocalIPAddress.ts
// utility function that returns the host's local IP address or `localhost`

import os from 'node:os';

export const getLocalIPAddress = (): string => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (ifaceList) {
      for (const iface of ifaceList) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  return 'localhost';
};
