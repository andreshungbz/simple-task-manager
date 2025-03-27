// Filename: url.test.ts
// vitest tests for non-valid task ID URL parameters

import { describe, test, expect } from 'vitest';
import { config } from '../src/config/app.config.js';

import {
  NonNumberIDParamError,
  NonexistentTaskError,
} from '../src/lib/CustomErrors.js';

describe('Non-numerical ID', () => {
  test('Complete', async () => {
    const response = await fetch(`${config.baseUrl}/tasks/test`, {
      method: 'PATCH',
    });
    expect(response.status).toBe(NonNumberIDParamError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      NonNumberIDParamError.appErrorCode
    );
  });

  test('Update Page', async () => {
    const response = await fetch(`${config.baseUrl}/update/tasks/test`);
    expect(response.status).toBe(NonNumberIDParamError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      NonNumberIDParamError.appErrorCode
    );
  });

  test('Delete', async () => {
    const response = await fetch(`${config.baseUrl}/tasks/test`, {
      method: 'DELETE',
    });
    expect(response.status).toBe(NonNumberIDParamError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      NonNumberIDParamError.appErrorCode
    );
  });
});

describe('Non-existent ID', () => {
  test('Update', async () => {
    const response = await fetch(`${config.baseUrl}/tasks/9999`, {
      method: 'PATCH',
    });
    expect(response.status).toBe(NonexistentTaskError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      NonexistentTaskError.appErrorCode
    );
  });

  test('Update Page', async () => {
    const response = await fetch(`${config.baseUrl}/update/tasks/9999`);
    expect(response.status).toBe(NonexistentTaskError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      NonexistentTaskError.appErrorCode
    );
  });

  test('Delete', async () => {
    const response = await fetch(`${config.baseUrl}/tasks/9999`, {
      method: 'DELETE',
    });
    expect(response.status).toBe(NonexistentTaskError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      NonexistentTaskError.appErrorCode
    );
  });
});
