import { test, expect } from 'vitest';
import * as s from '@/lib/http/schemas';
import { call, error } from './helpers';
import { cmpEth } from '@/lib/money';
test('catalog pagination and combined filters reflect request', async () => {
  const list = await call('get', '/nfts', s.nftListResponseSchema);
  expect(list.total).toBe(64);
  expect(list.items).toHaveLength(12);
  const filtered = await call(
    'get',
    '/nfts?categories=Arte%20digital&categories=Arte%203D&minPrice=0.02&maxPrice=2&sort=price_desc&pageSize=48',
    s.nftListResponseSchema
  );
  expect(filtered.items.length).toBeGreaterThan(0);
  for (const nft of filtered.items) {
    expect(nft.categories).toEqual(
      expect.arrayContaining(['Arte digital', 'Arte 3D'])
    );
    expect(cmpEth(nft.price, '2')).toBeLessThanOrEqual(0);
  }
  for (let i = 1; i < filtered.items.length; i++)
    expect(
      cmpEth(filtered.items[i - 1].price, filtered.items[i].price)
    ).toBeGreaterThanOrEqual(0);
  expect(
    (await call('get', '/nfts?page=999', s.nftListResponseSchema)).items
  ).toEqual([]);
  expect(
    (await call('get', '/nfts?q=absent', s.nftListResponseSchema)).total
  ).toBe(0);
});
test('detail, 404 and invalid filters', async () => {
  await call('get', '/nfts/golden-signal-160', s.nftSchema);
  await error('get', '/nfts/absent', 'NOT_FOUND', 404);
  for (const query of ['page=0', 'pageSize=49', 'minPrice=2&maxPrice=1'])
    await error('get', `/nfts?${query}`, 'VALIDATION_ERROR', 422);
});
