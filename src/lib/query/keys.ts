import type { NftListQuery } from '@/types/api';

const user = (userId?: string | null) => userId || 'anon';

export const keyFactory = {
  belongsToUser: (key: readonly unknown[], userId: string) =>
    key[0] === 'nfts'
      ? key[1] === 'list' && key[3] === userId
      : ['favorites', 'cart', 'quote', 'order', 'profile', 'wallets'].includes(
          String(key[0])
        ) && key[1] === userId,
  nfts: {
    all: ['nfts'] as const,
    list: (params: Partial<NftListQuery>, userId?: string | null) =>
      ['nfts', 'list', params, user(userId)] as const,
    detail: (id: string) => ['nfts', 'detail', id] as const,
  },
  favorites: {
    all: (userId?: string | null) => ['favorites', user(userId)] as const,
  },
  cart: (userId?: string | null) => ['cart', user(userId)] as const,
  quote: (userId?: string | null, coupon?: string | null) =>
    ['quote', user(userId), coupon ?? null] as const,
  order: (userId: string | null | undefined, id: string) =>
    ['order', user(userId), id] as const,
  profile: (userId?: string | null) => ['profile', user(userId)] as const,
  wallets: (userId?: string | null) => ['wallets', user(userId)] as const,
};
