import { SortSelect } from '@/components/shared/SortSelect';
import type { CatalogFilterState } from '../search-params';

interface CatalogToolbarProps {
  sort: CatalogFilterState['sort'];
  onSortChange: (sort: CatalogFilterState['sort']) => void;
}

const sortOptions = [
  ['relevance', 'Todos os NFTs'],
  ['recent', 'Novos lançamentos'],
  ['popular', 'Em alta'],
] as const;

export function CatalogToolbar({ sort, onSortChange }: CatalogToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4 md:mb-8">
      <div
        role="group"
        aria-label="Seleção de catálogo"
        className="text-body-combo md:text-body-sm flex gap-4"
      >
        {sortOptions.map(([optionSort, label]) => (
          <button
            key={optionSort}
            onClick={() => onSortChange(optionSort)}
            aria-pressed={sort === optionSort}
            className={`border-b-2 pb-1.5 ${sort === optionSort ? 'border-primary text-primary' : 'text-text-foreground border-transparent'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <SortSelect value={sort} onChange={onSortChange} />
    </div>
  );
}
