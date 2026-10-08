# Catálogo

`components/CatalogPage.tsx` compõe a tela sem implementar consultas ou controles.

- `hooks/useCatalog.ts`: URL, navegação, consultas e ações de favoritos.
- `components/CatalogHero.tsx`: destaque principal.
- `components/CatalogSidebar.tsx` e `CatalogMobileControls.tsx`: busca e filtros por breakpoint.
- `components/FilterBar.tsx`: categorias, preço e validação.
- `components/CatalogResults.tsx`: estados de dados, grid e paginação.
- `components/CatalogToolbar.tsx` e `CatalogStatus.tsx`: ordenação e feedback acessível.
- `components/CatalogEditorial.tsx`: promoções e artigos.

Os componentes reutilizáveis ficam em `src/components/shared`: `SearchInput`,
`NFTCard`, `NFTCardSkeleton`, `NFTGrid`, `Price`, `ErrorState`, `EmptyState`,
`SortSelect` e `Pagination`. Cabeçalho, rodapé e navegação mobile ficam em
`src/components/layout`. Os estilos ficam inline em `className`, com utilitários Tailwind nos próprios componentes.

## Carregamento

`src/routes/index.tsx` mantém a validação dos parâmetros. `index.lazy.tsx` carrega
a composição apenas quando a rota é acessada, sem importar a rota dentro da feature.
`CatalogDesktopSections` forma um segundo chunk carregado com `React.lazy` apenas
quando `(min-width: 768px)` corresponde. A mudança de viewport também atualiza essa
condição. O bloco preserva a navegação direta para `#diario` após carregar.

Para ajustar o visual, altere a seção correspondente ou o componente compartilhado;
não replique os estilos de cards, busca e estados dentro da página.
