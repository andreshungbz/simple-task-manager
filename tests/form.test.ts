// Filename: form.test.ts
// vitest tests for validating task fields when creating and updating tasks

import { describe, test, expect } from 'vitest';
import { config } from '../src/config/app.config.js';

import {
  MissingTitleError,
  TitleLengthError,
  DescriptionLengthError,
} from '../src/lib/CustomErrors.js';

describe('New Task', () => {
  test('Title Missing', async () => {
    const data: URLSearchParams = new URLSearchParams();
    data.set('taskTitle', '');
    data.set('taskDescription', '');
    data.set('taskPriority', 'low');

    const response = await fetch(`${config.baseUrl}/tasks`, {
      method: 'POST',
      body: data,
    });

    expect(response.status).toBe(MissingTitleError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      MissingTitleError.appErrorCode
    );
  });

  test('Title Too Short', async () => {
    const data: URLSearchParams = new URLSearchParams();
    data.set('taskTitle', 't');
    data.set('taskDescription', 'where');
    data.set('taskPriority', 'low');

    const response = await fetch(`${config.baseUrl}/tasks`, {
      method: 'POST',
      body: data,
    });

    expect(response.status).toBe(TitleLengthError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      TitleLengthError.appErrorCode
    );
  });

  test('Title Too Long', async () => {
    const data: URLSearchParams = new URLSearchParams();
    data.set('taskTitle', 't'.repeat(101));
    data.set('taskDescription', 'where');
    data.set('taskPriority', 'low');

    const response = await fetch(`${config.baseUrl}/tasks`, {
      method: 'POST',
      body: data,
    });

    expect(response.status).toBe(TitleLengthError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      TitleLengthError.appErrorCode
    );
  });

  test('Description Too Long', async () => {
    const data: URLSearchParams = new URLSearchParams();
    data.set('taskTitle', 'Test');
    data.set('taskDescription', 'd'.repeat(501));
    data.set('taskPriority', 'low');

    const response = await fetch(`${config.baseUrl}/tasks`, {
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
  test('Title Missing', async () => {
    const data: URLSearchParams = new URLSearchParams();
    data.set('taskTitle', '');
    data.set('taskDescription', '');
    data.set('taskPriority', 'low');

    const response = await fetch(`${config.baseUrl}/tasks/1`, {
      method: 'PUT',
      body: data,
    });

    expect(response.status).toBe(MissingTitleError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      MissingTitleError.appErrorCode
    );
  });

  test('Title Too Short', async () => {
    const data: URLSearchParams = new URLSearchParams();
    data.set('taskTitle', 't');
    data.set('taskDescription', 'where');
    data.set('taskPriority', 'low');

    const response = await fetch(`${config.baseUrl}/tasks/1`, {
      method: 'PUT',
      body: data,
    });

    expect(response.status).toBe(TitleLengthError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      TitleLengthError.appErrorCode
    );
  });

  test('Title Too Long', async () => {
    const data: URLSearchParams = new URLSearchParams();
    data.set('taskTitle', 't'.repeat(101));
    data.set('taskDescription', 'where');
    data.set('taskPriority', 'low');

    const response = await fetch(`${config.baseUrl}/tasks/1`, {
      method: 'PUT',
      body: data,
    });

    expect(response.status).toBe(TitleLengthError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      TitleLengthError.appErrorCode
    );
  });

  test('Description Too Long', async () => {
    const data: URLSearchParams = new URLSearchParams();
    data.set('taskTitle', 'Test');
    data.set('taskDescription', 'd'.repeat(501));
    data.set('taskPriority', 'low');

    const response = await fetch(`${config.baseUrl}/tasks/1`, {
      method: 'PUT',
      body: data,
    });

    expect(response.status).toBe(DescriptionLengthError.httpErrorCode);
    expect(response.headers.get('X-STM-Error')).toBe(
      DescriptionLengthError.appErrorCode
    );
  });
});
