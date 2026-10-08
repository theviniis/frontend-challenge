import { useId } from 'react';
import type { CatalogFilterState } from '@/features/catalog/search-params';

export function SortSelect({
  value,
  onChange,
}: {
  value: CatalogFilterState['sort'];
  onChange: (value: CatalogFilterState['sort']) => void;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="text-tiny text-text-secondary flex items-center gap-2"
    >
      Ordenar por:
      <select
        id={id}
        className="border-border bg-surface-card text-foreground min-w-0 rounded border p-2"
        value={value}
        onChange={(event) =>
          onChange(event.target.value as CatalogFilterState['sort'])
        }
      >
        <option value="relevance">Relevância</option>
        <option value="recent">Listados recentemente</option>
        <option value="price_asc">Menor preço</option>
        <option value="price_desc">Maior preço</option>
        <option value="popular">Mais populares</option>
      </select>
    </label>
  );
}
