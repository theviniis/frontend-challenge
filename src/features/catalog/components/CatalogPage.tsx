import { lazy, Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useCatalog } from '../hooks/useCatalog';
import { CatalogHero } from './CatalogHero';
import { CatalogMobileControls } from './CatalogMobileControls';
import { CatalogSidebar } from './CatalogSidebar';
import { CatalogResults } from './CatalogResults';
import '../catalog.css';

const DesktopSections = lazy(() =>
  import('./CatalogDesktopSections').then((module) => ({
    default: module.CatalogDesktopSections,
  }))
);

export function CatalogPage() {
  const catalog = useCatalog();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const controls = {
    filters: catalog.filters,
    onChange: catalog.onFiltersChange,
    onSearch: catalog.onSearch,
  };

  return (
    <div className="catalog-page mx-auto max-w-300">
      <h1 className="sr-only">Início</h1>
      <Header marketHref="#catalogo" learnHref="#diario" divider />
      <CatalogMobileControls {...controls} />
      <CatalogHero />
      <section
        id="catalogo"
        className="catalog-layout grid scroll-mt-6 gap-12 md:mt-24 md:grid-cols-[250px_minmax(0,1fr)] lg:grid-cols-[310px_minmax(0,1fr)]"
      >
        <CatalogSidebar {...controls} />
        <CatalogResults catalog={catalog} />
      </section>
      {isDesktop && (
        <Suspense fallback={null}>
          <DesktopSections />
        </Suspense>
      )}
      <MobileNavigation />
    </div>
  );
}
