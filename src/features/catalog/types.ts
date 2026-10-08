import type { CatalogFilterState } from './search-params';

export interface CatalogControlsProps {
  filters: CatalogFilterState;
  onChange: (next: Partial<CatalogFilterState>) => void;
  onSearch: (query: string) => void;
}
