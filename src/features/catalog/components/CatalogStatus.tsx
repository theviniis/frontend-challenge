import type { CatalogController } from '../hooks/useCatalog';

export function CatalogStatus({
  query,
  page,
}: {
  query: CatalogController['query'];
  page: number;
}) {
  return (
    <p
      className="text-tiny text-text-secondary mb-4"
      role="status"
      aria-live="polite"
    >
      {query.isPending
        ? 'Carregando NFTs…'
        : query.isFetching
          ? 'Atualizando catálogo…'
          : query.isError
            ? 'Não foi possível carregar o catálogo.'
            : `${query.data.total} NFTs encontrados · Página ${page}`}
    </p>
  );
}
