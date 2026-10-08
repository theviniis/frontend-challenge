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
      className="text-body-combo text-foreground hidden items-center gap-2 border-b-2 border-transparent pb-1.5 md:flex"
    >
      Ordenar por:
      <select
        id={id}
        className="text-body-combo text-foreground h-4 min-w-0 p-0"
        value={value}
        onChange={(event) =>
          onChange(event.target.value as CatalogFilterState['sort'])
        }
      >
        <option className="bg-surface-card" value="relevance">
          Relevância
        </option>
        <option className="bg-surface-card" value="recent">
          Listados recentemente
        </option>
        <option className="bg-surface-card" value="price_asc">
          Menor preço
        </option>
        <option className="bg-surface-card" value="price_desc">
          Maior preço
        </option>
        <option className="bg-surface-card" value="popular">
          Mais populares
        </option>
      </select>
    </label>
  );
}
