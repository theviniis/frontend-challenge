import { SearchInput } from '@/components/shared/SearchInput';
import { FilterBar } from './FilterBar';
import type { CatalogControlsProps } from '../types';

export function CatalogSidebar({
  filters,
  onChange,
  onSearch,
}: CatalogControlsProps) {
  const filterKey = JSON.stringify([filters.minPrice, filters.maxPrice]);
  return (
    <aside className="hidden md:block" aria-label="Filtros do catálogo">
      <div className="mb-5">
        <SearchInput
          key={filters.q ?? ''}
          value={filters.q ?? ''}
          onSearch={onSearch}
        />
      </div>
      <FilterBar key={filterKey} filters={filters} onChange={onChange} />
      <div className="bg-surface-card mt-6 overflow-hidden rounded-lg text-center">
        <h2 className="text-h2 text-text-accent px-5 pt-6 font-bold">
          NFT EM DESTAQUE
        </h2>
        <p className="text-title mt-4 font-bold">OFERTA LIMITADA</p>
        <img
          src="/assets/nft/sage-nomad-009.png"
          alt="Sage Nomad, NFT em destaque"
          className="mt-4 w-full object-cover"
          width={1254}
          height={1254}
        />
      </div>
    </aside>
  );
}
