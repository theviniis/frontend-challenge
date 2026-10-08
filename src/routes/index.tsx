import { createFileRoute } from '@tanstack/react-router';
import { useQueryState } from 'nuqs';
import { catalogFilterParser } from '@/features/catalog/search-params';
import { RoutePlaceholder } from '@/components/shared/RoutePlaceholder';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  const [filters, setFilters] = useQueryState('filters', catalogFilterParser);

  return (
    <RoutePlaceholder
      title="Início"
      frames="2:2 (desktop) / 14:5226 (mobile)"
      access="pública"
      description="Destaques, catálogo, busca, filtros e ordenação gerenciados com nuqs + TanStack Router + Zod."
    >
      <div className="space-y-4 font-mono">
        <h3 className="text-body-sm font-bold text-text-accent">
          Estado dos Filtros (via nuqs parseAsJson com Zod):
        </h3>
        <pre className="rounded bg-surface-dark p-3 text-tiny text-text-secondary overflow-x-auto">
          {JSON.stringify(filters, null, 2)}
        </pre>

        <div className="space-y-2">
          <p className="text-tiny text-text-secondary">
            Modificações reativas na URL via hook useQueryState:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilters({ q: 'cyberpunk', page: 1 })}
              className="rounded border border-border bg-surface-dark px-3 py-1 text-tiny hover:border-primary cursor-pointer"
            >
              Buscar: 'cyberpunk'
            </button>
            <button
              type="button"
              onClick={() =>
                setFilters({
                  categories: ['Arte digital', 'Colecionáveis'],
                  sort: 'price_asc',
                  minPrice: '0.1',
                  maxPrice: '5.0',
                  page: 2,
                })
              }
              className="rounded border border-border bg-surface-dark px-3 py-1 text-tiny hover:border-primary cursor-pointer"
            >
              Filtro: Categorias + Preços + Sort + Página 2
            </button>
            <button
              type="button"
              onClick={() => setFilters(null)}
              className="rounded border border-border bg-surface-dark px-3 py-1 text-tiny hover:border-coral text-coral cursor-pointer"
            >
              Limpar Filtros (Reset URL)
            </button>
          </div>
        </div>
      </div>
    </RoutePlaceholder>
  );
}
