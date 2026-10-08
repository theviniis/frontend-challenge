# 10 — Tela Detalhes do NFT + favoritos

**Onda:** 5 · **Paralela com:** — · **Depende de:** 08, 09 · **Bloqueia:** 11
**Label sugerido:** `ui` · **Esforço:** M

## Objetivo

Tela de detalhe com galeria, informação, quantidade e compra; favoritos com
atualização otimista protegida por sessão.

## Subtasks

### 10.1 — Composição + galeria

- Frames `10:244` (desktop) / `15:5536` (mobile): galeria de imagens, descrição,
  coleção/criador, atributos, status `RARO`

### 10.2 — Casos especiais de acesso

- Acesso direto por URL + refresh · NFT inexistente → estado 404 amigável com link
  ao catálogo · bloco de **edição indisponível** quando `editable: false`

### 10.3 — Quantidade e compra

- `QuantityStepper` com limite de `available` · botão comprar → adiciona ao carrinho
  e navega

### 10.4 — Favorito otimista

- Molde cancel → snapshot → apply → rollback + toast de erro; `onSettled` invalida
  `favorites`; visitante → `/login?redirect=` e retorno ao fluxo

### 10.5 — Skeletons e feedback

- Skeleton shimmer na galeria/card de compra · feedback `aria-live` nas mutações

## Critérios de aceite (gate)

- [ ] Cenário `erro-4xx` mostra 404 amigável; falha de favorito faz rollback correto
- [ ] `pnpm typecheck && pnpm lint` verdes · conferência com o frame

## Referências

- `docs/api/nfts.md`, `docs/api/favorites.md` · `ARCHITECTURE.md` §3.4 · frames `10:244`/`15:5536`
