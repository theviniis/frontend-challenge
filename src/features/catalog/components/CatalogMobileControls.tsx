import { SearchInput } from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FilterBar } from './FilterBar';
import type { CatalogControlsProps } from '../types';

export function CatalogMobileControls({
  filters,
  onChange,
  onSearch,
}: CatalogControlsProps) {
  const filterKey = JSON.stringify([filters.minPrice, filters.maxPrice]);
  return (
    <div className="catalog-mobile-search mb-4 flex gap-2 md:hidden">
      <SearchInput
        key={filters.q ?? ''}
        value={filters.q ?? ''}
        onSearch={onSearch}
      />
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" aria-label="Abrir filtros">
            <img src="/icons/iconly-curved-filter-15-5488.svg" alt="" />
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>
              Combine coleções e preços para explorar NFTs.
            </SheetDescription>
          </SheetHeader>
          <FilterBar key={filterKey} filters={filters} onChange={onChange} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
