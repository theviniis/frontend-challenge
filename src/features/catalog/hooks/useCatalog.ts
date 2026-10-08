import { useSyncExternalStore } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getStoredSession, subscribeSession } from '@/lib/session/storage';
import type { Nft } from '@/types/api';
import { catalogOptions, useFavorites } from '../queries';
import type { CatalogFilterState } from '../search-params';

// Access route state without importing its module into the lazy page chunk.
const catalogRoute = getRouteApi('/');

export function useCatalog() {
  const filters = catalogRoute.useSearch();
  const navigate = catalogRoute.useNavigate();
  const userId = useSyncExternalStore(
    subscribeSession,
    () => getStoredSession()?.user.id,
    () => undefined
  );
  const query = useQuery(catalogOptions(filters));
  const { favorites, mutation } = useFavorites(userId);

  function onFiltersChange(next: Partial<CatalogFilterState>) {
    void navigate({
      search: (previous) => ({ ...previous, ...next, page: 1 }),
    });
  }

  function onFavorite(nft: Nft) {
    if (!userId) {
      void navigate({
        to: '/login',
        search: { redirect: window.location.pathname + window.location.search },
      });
      return;
    }
    mutation.mutate({
      id: nft.id,
      selected: favorites.data?.ids.includes(nft.id) ?? false,
    });
  }

  function onPageChange(page: number) {
    void navigate({ search: (previous) => ({ ...previous, page }) });
    document
      .getElementById('catalogo')
      ?.scrollIntoView({ behavior: 'instant' });
  }

  return {
    filters,
    query,
    favorites,
    userId,
    favoriteIds: favorites.data?.ids ?? [],
    isFavoritePending: mutation.isPending || (!!userId && !favorites.data),
    onFavorite,
    onFiltersChange,
    onPageChange,
    onSearch: (q: string) => onFiltersChange({ q: q || undefined }),
    onClear: () => {
      void navigate({ search: { sort: 'relevance', page: 1 } });
    },
    onRetry: () => {
      void query.refetch();
    },
    onFavoritesRetry: () => {
      void favorites.refetch();
    },
  };
}

export type CatalogController = ReturnType<typeof useCatalog>;
