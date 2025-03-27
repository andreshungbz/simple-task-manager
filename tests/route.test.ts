// Filename: route.test.ts
// vitest testing routes

import { test, expect } from 'vitest';
import { config } from '../src/config/app.config';

test('Undefined Routes', async () => {
  const response = await fetch(`${config.baseUrl}/undefined`);
  expect(response.status).toBe(404);
});
