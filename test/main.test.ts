// Filename: main.test.ts
// test file to be run by vitest or "npm run test"
// cannot be run while server is running
// assumes task with ID exists and task with ID 9999 does not

import { describe, test, expect, beforeAll } from 'vitest';
import { baseUrl } from '../src/app.js';
import { URLSearchParams } from 'url';

import {
  MissingTitleError,
  TitleLengthError,
  DescriptionLengthError,
  NonNumberIDParamError,
  NonexistentTaskError,
} from '../src/lib/CustomErrors.js';

beforeAll(() => {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
});

describe('Routes', () => {
  test('Undefined Routes', async () => {
    const response = await fetch(`${baseUrl}/undefined`);
    expect(response.status).toBe(404);
  });
});

describe('Forms', () => {
  describe('New Task', () => {
    test('Missing Task Title', async () => {
      const data: URLSearchParams = new URLSearchParams();
      data.set('taskTitle', '');
      data.set('taskDescription', '');
      data.set('taskPriority', 'low');

      const response = await fetch(`${baseUrl}/tasks`, {
        method: 'POST',
        body: data,
      });

      expect(response.status).toBe(MissingTitleError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        MissingTitleError.appErrorCode
      );
    });

    test('Too Short Task Title', async () => {
      const data: URLSearchParams = new URLSearchParams();
      data.set('taskTitle', 't');
      data.set('taskDescription', 'where');
      data.set('taskPriority', 'low');

      const response = await fetch(`${baseUrl}/tasks`, {
        method: 'POST',
        body: data,
      });

      expect(response.status).toBe(TitleLengthError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        TitleLengthError.appErrorCode
      );
    });

    test('Too Long Task Title', async () => {
      const data: URLSearchParams = new URLSearchParams();
      data.set('taskTitle', 't'.repeat(101));
      data.set('taskDescription', 'where');
      data.set('taskPriority', 'low');

      const response = await fetch(`${baseUrl}/tasks`, {
        method: 'POST',
        body: data,
      });

      expect(response.status).toBe(TitleLengthError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        TitleLengthError.appErrorCode
      );
    });

    test('Too Long Task Description', async () => {
      const data: URLSearchParams = new URLSearchParams();
      data.set('taskTitle', 'Test');
      data.set('taskDescription', 'd'.repeat(501));
      data.set('taskPriority', 'low');

      const response = await fetch(`${baseUrl}/tasks`, {
        method: 'POST',
        body: data,
      });

      expect(response.status).toBe(DescriptionLengthError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        DescriptionLengthError.appErrorCode
      );
    });
  });

  describe('Update Task', () => {
    test('Missing Task Title', async () => {
      const data: URLSearchParams = new URLSearchParams();
      data.set('taskTitle', '');
      data.set('taskDescription', '');
      data.set('taskPriority', 'low');

      const response = await fetch(`${baseUrl}/tasks/1`, {
        method: 'PUT',
        body: data,
      });

      expect(response.status).toBe(MissingTitleError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        MissingTitleError.appErrorCode
      );
    });

    test('Too Short Task Title', async () => {
      const data: URLSearchParams = new URLSearchParams();
      data.set('taskTitle', 't');
      data.set('taskDescription', 'where');
      data.set('taskPriority', 'low');

      const response = await fetch(`${baseUrl}/tasks/1`, {
        method: 'PUT',
        body: data,
      });

      expect(response.status).toBe(TitleLengthError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        TitleLengthError.appErrorCode
      );
    });

    test('Too Long Task Title', async () => {
      const data: URLSearchParams = new URLSearchParams();
      data.set('taskTitle', 't'.repeat(101));
      data.set('taskDescription', 'where');
      data.set('taskPriority', 'low');

      const response = await fetch(`${baseUrl}/tasks/1`, {
        method: 'PUT',
        body: data,
      });

      expect(response.status).toBe(TitleLengthError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        TitleLengthError.appErrorCode
      );
    });

    test('Too Long Task Description', async () => {
      const data: URLSearchParams = new URLSearchParams();
      data.set('taskTitle', 'Test');
      data.set('taskDescription', 'd'.repeat(501));
      data.set('taskPriority', 'low');

      const response = await fetch(`${baseUrl}/tasks/1`, {
        method: 'PUT',
        body: data,
      });

      expect(response.status).toBe(DescriptionLengthError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        DescriptionLengthError.appErrorCode
      );
    });
  });
});

describe('URL', () => {
  describe('Non-numerical ID', () => {
    test('Update', async () => {
      const response = await fetch(`${baseUrl}/tasks/test`, {
        method: 'PATCH',
      });
      expect(response.status).toBe(NonNumberIDParamError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        NonNumberIDParamError.appErrorCode
      );
    });

    test('Update Page', async () => {
      const response = await fetch(`${baseUrl}/update/tasks/test`);
      expect(response.status).toBe(NonNumberIDParamError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        NonNumberIDParamError.appErrorCode
      );
    });

    test('Delete', async () => {
      const response = await fetch(`${baseUrl}/tasks/test`, {
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
      const response = await fetch(`${baseUrl}/tasks/9999`, {
        method: 'PATCH',
      });
      expect(response.status).toBe(NonexistentTaskError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        NonexistentTaskError.appErrorCode
      );
    });

    test('Update Page', async () => {
      const response = await fetch(`${baseUrl}/update/tasks/9999`);
      expect(response.status).toBe(NonexistentTaskError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        NonexistentTaskError.appErrorCode
      );
    });

    test('Delete', async () => {
      const response = await fetch(`${baseUrl}/tasks/9999`, {
        method: 'DELETE',
      });
      expect(response.status).toBe(NonexistentTaskError.httpErrorCode);
      expect(response.headers.get('X-STM-Error')).toBe(
        NonexistentTaskError.appErrorCode
      );
    });
  });
});
