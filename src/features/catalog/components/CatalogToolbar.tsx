import { SortSelect } from '@/components/shared/SortSelect';
import type { CatalogFilterState } from '../search-params';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

interface CatalogToolbarProps {
  sort: CatalogFilterState['sort'];
  onSortChange: (sort: CatalogFilterState['sort']) => void;
}

const sortOptions = [
  ['relevance', 'Todos os NFTs'],
  ['recent', 'Novos lançamentos'],
  ['popular', 'Em alta'],
] as const;

function CatalogButton({
  optionSort,
  sort,
  children,
  className,
  ...props
}: ComponentProps<'button'> & { optionSort: string; sort: string }) {
  const isActive = sort === optionSort;
  return (
    <button
      {...props}
      aria-pressed={isActive}
      className={cn(
        'cursor-pointer border-b-2 border-transparent pb-1.5',
        isActive
          ? 'border-primary text-primary text-body-bold'
          : 'text-foreground text-body-sm',
        'md:text-body-combo',
        className
      )}
    >
      {children}
    </button>
  );
}

export function CatalogToolbar({ sort, onSortChange }: CatalogToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-4 md:mb-8">
      <div role="group" aria-label="Seleção de catálogo" className="flex gap-4">
        {sortOptions.map(([optionSort, label]) => (
          <CatalogButton
            key={optionSort}
            optionSort={optionSort}
            sort={sort}
            onClick={() => onSortChange(optionSort)}
          >
            {label}
          </CatalogButton>
        ))}
      </div>
      <SortSelect value={sort} onChange={onSortChange} />
    </div>
  );
}
