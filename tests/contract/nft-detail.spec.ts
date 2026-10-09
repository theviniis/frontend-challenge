import { expect, test } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { nftSchema } from '@/lib/http/schemas';
import { keyFactory } from '@/lib/query/keys';
import { applyNftEvent, newestNft } from '@/lib/socket/nft-cache';
import { nftDetailFilterSchema } from '@/features/nft-detail/search-params';
import { getSeedNft } from '@/mocks/fixtures/nfts';
import { call } from './helpers';

test('detail supplies optional metadata and a complete gallery', async () => {
  const nft = await call('get', '/nfts/emerald-ape-042', nftSchema);
  expect(nft).toMatchObject({
    name: 'Emerald Ape #042',
    price: '1.19',
    tokenId: '0042',
    edition: { current: 1, total: 50 },
    reviews: { average: 4.8, count: 19 },
  });
  expect(nft.images).toHaveLength(4);
  expect(nft.contract?.royalties).toBe('5');
  const legacy = {
    ...nft,
    tokenId: undefined,
    details: undefined,
    contract: undefined,
    reviews: undefined,
  };
  expect(nftSchema.safeParse(legacy).success).toBe(true);
  expect(
    nftSchema.safeParse({ ...nft, reviews: { ...nft.reviews, average: 6 } })
      .success
  ).toBe(false);
});

test('invalid quantity is normalized without breaking the public route', () => {
  for (const qty of [
    undefined,
    '',
    'invalid',
    0,
    -2,
    1.5,
    Infinity,
    '9007199254740992',
  ])
    expect(nftDetailFilterSchema.parse({ qty }).qty).toBe(1);
  expect(nftDetailFilterSchema.parse({ qty: '5' }).qty).toBe(5);
});

test('socket ordering protects detail, lists and late REST responses', () => {
  const client = new QueryClient();
  const nft = getSeedNft('emerald-ape-042');
  const detailKey = keyFactory.nfts.detail(nft.id);
  const listKey = keyFactory.nfts.list({}, 'anon');
  client.setQueryData(detailKey, nft);
  client.setQueryData(listKey, {
    items: [nft],
    total: 1,
    page: 1,
    pageSize: 1,
    facets: { categories: [], networks: [] },
  });
  const event = {
    type: 'nft.updated',
    resourceId: nft.id,
    version: 3,
    ts: '2026-08-04T12:00:00.000Z',
    payload: { price: '2.19', previousPrice: '1.19', available: 2 },
  };
  applyNftEvent(client, event);
  applyNftEvent(client, {
    ...event,
    version: 2,
    payload: { ...event.payload, price: '0.01' },
  });
  expect(client.getQueryData(detailKey)).toMatchObject({
    version: 3,
    price: '2.19',
    available: 2,
  });
  expect(client.getQueryData(listKey)).toMatchObject({
    items: [{ version: 3, price: '2.19' }],
  });
  expect(newestNft(client, nft).price).toBe('2.19');
  client.clear();
  applyNftEvent(client, event);
  expect(newestNft(client, nft)).toMatchObject({ price: '2.19', version: 3 });
  client.clear();
});
