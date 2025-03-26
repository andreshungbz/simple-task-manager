import { test, expect } from 'vitest';
import { baseUrl } from '../src/app.js';

test('Undefined Routes', async () => {
  const response = await fetch(`${baseUrl}/undefined`);
  expect(response.status).toBe(404);
});
