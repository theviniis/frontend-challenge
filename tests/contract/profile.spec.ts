import { test, expect } from 'vitest';
import * as s from '@/lib/http/schemas';
import { http } from '@/lib/http/client';
import { call, error, login, scenario } from './helpers';
test('profile editing uniqueness and password change', async () => {
  const headers = await login();
  await call('get', '/profile', s.profileSchema, undefined, headers);
  expect(
    (
      await call(
        'patch',
        '/profile',
        s.profileSchema,
        { name: 'Ana C.', bio: 'Arte' },
        headers
      )
    ).name
  ).toBe('Ana C.');
  await error(
    'patch',
    '/profile',
    'CONFLICT',
    409,
    { username: 'bruno' },
    headers
  );
  await error(
    'patch',
    '/profile',
    'VALIDATION_ERROR',
    422,
    { avatarUrl: 'data:text/plain;base64,YQ==' },
    headers
  );
  await error(
    'post',
    '/profile/password',
    'VALIDATION_ERROR',
    422,
    { currentPassword: 'wrong', newPassword: 'NovaSenha123' },
    headers
  );
  expect(
    (
      await http.post(
        'http://localhost/api/profile/password',
        { currentPassword: 'Ana12345', newPassword: 'NovaSenha123' },
        { headers }
      )
    ).status
  ).toBe(204);
  await call('post', '/auth/login', s.sessionSchema, {
    email: 'ana@greenmint.test',
    password: 'NovaSenha123',
  });
  await scenario('validacao-api');
  await error(
    'patch',
    '/profile',
    'VALIDATION_ERROR',
    422,
    { name: 'Ana' },
    headers
  );
});
