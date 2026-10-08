import type { NftListQuery } from '@/types/api';

const user = (userId?: string | null) => userId || 'anon';

export const keyFactory = {
  nfts: {
    all: ['nfts'] as const,
    list: (params: Partial<NftListQuery>) => ['nfts', 'list', params] as const,
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
