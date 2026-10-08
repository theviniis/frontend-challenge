import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { http } from '@/lib/http/client';
import { endpoints } from '@/lib/http/endpoints';
import {
  nftListResponseSchema,
  favoritesResponseSchema,
} from '@/lib/http/schemas';
import type { FavoritesResponse } from '@/types/api';
import { keyFactory } from '@/lib/query/keys';
import type { CatalogFilterState } from './search-params';

export const CATALOG_PAGE_SIZE = 9;

export const catalogOptions = (filters: CatalogFilterState, userId?: string) =>
  queryOptions({
    queryKey: keyFactory.nfts.list(
      { ...filters, pageSize: CATALOG_PAGE_SIZE },
      userId
    ),
    queryFn: async ({ signal }) =>
      nftListResponseSchema.parse(
        (
          await http.get<unknown>(endpoints.nfts, {
            params: { ...filters, pageSize: CATALOG_PAGE_SIZE },
            signal,
          })
        ).data
      ),
  });

export function useFavorites(userId?: string) {
  const client = useQueryClient();
  const queryKey = keyFactory.favorites.all(userId);
  const favorites = useQuery({
    queryKey,
    enabled: !!userId,
    queryFn: async ({ signal }) =>
      favoritesResponseSchema.parse(
        (await http.get<unknown>(endpoints.favorites, { signal })).data
      ),
  });
  const mutation = useMutation({
    mutationFn: async ({ id, selected }: { id: string; selected: boolean }) => {
      const response = selected
        ? await http.delete<unknown>(endpoints.favorite(id))
        : await http.put<unknown>(endpoints.favorite(id));
      return favoritesResponseSchema.parse(response.data);
    },
    onMutate: async ({ id, selected }) => {
      await client.cancelQueries({ queryKey });
      const snapshot = client.getQueryData<FavoritesResponse>(queryKey);
      const ids = selected
        ? (snapshot?.ids ?? []).filter((value) => value !== id)
        : [...(snapshot?.ids ?? []), id];
      client.setQueryData(queryKey, { ids, count: ids.length });
      return { snapshot };
    },
    onError: (_error, _variables, context) => {
      client.setQueryData(queryKey, context?.snapshot ?? { ids: [], count: 0 });
      toast.error('Não foi possível atualizar o favorito. Tente novamente.');
    },
    onSuccess: (_data, { selected }) =>
      toast.success(
        selected ? 'NFT removido dos favoritos' : 'NFT adicionado aos favoritos'
      ),
    onSettled: () => client.invalidateQueries({ queryKey }),
  });
  return { favorites, mutation };
}
