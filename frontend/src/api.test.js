import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';
import { ApiError, apiCollection, apiRequest, apiUrl } from './api.js';

afterEach(() => mock.restoreAll());

test('uses the current host via /api or an explicitly configured base', () => {
  assert.equal(apiUrl('/partidos/'), '/api/partidos/');
  assert.equal(apiUrl('/partidos/', 'https://vertice.example/api/'), 'https://vertice.example/api/partidos/');
});

test('sends credentials and JSON to the same origin', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () => Response.json({ ok: true }));
  await apiRequest('/login', { method: 'POST', body: { username: 'test', password: 'test' } });
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, '/api/login');
  assert.equal(options.credentials, 'include');
  assert.equal(options.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(options.body), { username: 'test', password: 'test' });
});

test('expired session is an error, never a catalogue object', async () => {
  mock.method(globalThis, 'fetch', async () => Response.json({ detail: 'Token expirado' }, { status: 401 }));
  await assert.rejects(apiCollection('/equipos/'), error => error instanceof ApiError && error.status === 401);
});

test('rejects malformed catalogues even when the status is 200', async () => {
  mock.method(globalThis, 'fetch', async () => Response.json({ detail: 'unexpected' }));
  await assert.rejects(apiCollection('/equipos/'), error => error.status === 502);
});

test('validation errors become readable text', async () => {
  mock.method(globalThis, 'fetch', async () => Response.json({ detail: [{ msg: 'Field required' }] }, { status: 422 }));
  await assert.rejects(apiRequest('/partidos/'), error => error.status === 422 && error.message === 'Field required');
});

test('handles a non-JSON reverse proxy error', async () => {
  mock.method(globalThis, 'fetch', async () => new Response('<h1>Bad Gateway</h1>', { status: 502 }));
  await assert.rejects(apiRequest('/partidos/'), error => error.status === 502);
});
