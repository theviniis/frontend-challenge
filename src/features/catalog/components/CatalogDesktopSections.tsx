import { useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { CatalogEditorial } from './CatalogEditorial';

export function CatalogDesktopSections() {
  useEffect(() => {
    // Preserve direct links to an anchor whose section arrives in a lazy chunk.
    if (window.location.hash === '#diario')
      document.getElementById('diario')?.scrollIntoView();
  }, []);
  return (
    <>
      <CatalogEditorial />
      <Footer />
    </>
  );
}
