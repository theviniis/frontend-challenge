import { test, expect } from 'vitest';
import * as s from '@/lib/http/schemas';
import { call, error, login } from './helpers';
const data = {
  label: 'Principal',
  address: `0x${'a'.repeat(40)}`,
  network: 'ethereum',
  isPrimary: true,
};
test('wallet create duplicate limit promote ownership and pending network', async () => {
  const ana = await login();
  const bruno = await login('bruno');
  expect(
    (await call('get', '/wallets', s.walletsListResponseSchema, undefined, ana))
      .items
  ).toHaveLength(2);
  const first = await call(
    'post',
    '/wallets',
    s.walletSchema,
    data,
    bruno,
    201
  );
  await error(
    'post',
    '/wallets',
    'CONFLICT',
    409,
    { ...data, address: data.address.toUpperCase().replace('0X', '0x') },
    bruno
  );
  const second = await call(
    'post',
    '/wallets',
    s.walletSchema,
    { ...data, address: `0x${'b'.repeat(40)}` },
    bruno,
    201
  );
  expect(second.isPrimary).toBe(true);
  await call(
    'patch',
    `/wallets/${first.id}`,
    s.walletSchema,
    { isPrimary: true },
    bruno
  );
  expect(
    (
      await call(
        'get',
        '/wallets',
        s.walletsListResponseSchema,
        undefined,
        bruno
      )
    ).items.filter((w) => w.isPrimary)
  ).toHaveLength(1);
  await error(
    'post',
    '/wallets',
    'CONFLICT',
    409,
    { ...data, address: `0x${'c'.repeat(40)}` },
    bruno
  );
  await error(
    'patch',
    '/wallets/wal_ana_principal',
    'FORBIDDEN',
    403,
    { label: 'Other' },
    bruno
  );
  await error(
    'patch',
    '/wallets/wal_ana_principal',
    'CONFLICT',
    409,
    { network: 'sepolia' },
    ana
  );
  await error('patch', '/wallets/absent', 'NOT_FOUND', 404, {}, ana);
  await error(
    'post',
    '/wallets',
    'VALIDATION_ERROR',
    422,
    { ...data, address: 'bad' },
    bruno
  );
});
