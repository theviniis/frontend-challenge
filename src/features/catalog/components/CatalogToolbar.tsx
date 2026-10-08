import { SortSelect } from '@/components/shared/SortSelect';
import type { CatalogFilterState } from '../search-params';

interface CatalogToolbarProps {
  sort: CatalogFilterState['sort'];
  onSortChange: (sort: CatalogFilterState['sort']) => void;
}
export function CatalogToolbar({ sort, onSortChange }: CatalogToolbarProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div
        role="group"
        aria-label="Seleção de catálogo"
        className="text-caption md:text-body-sm flex gap-4"
      >
        {(
          [
            ['relevance', 'Todos os NFTs'],
            ['recent', 'Novos lançamentos'],
            ['popular', 'Em alta'],
          ] as const
        ).map(([sort, label]) => (
          <button
            key={sort}
            onClick={() => onSortChange(sort)}
            aria-pressed={sort === sort}
            className={`border-b-2 pb-2 ${sort === sort ? 'border-primary text-primary' : 'text-text-secondary border-transparent'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <SortSelect value={sort} onChange={onSortChange} />
    </div>
  );
}
