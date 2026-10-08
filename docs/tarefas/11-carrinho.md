# 11 — Tela Carrinho (itens, cupom, cotação, tempo real)

**Onda:** 6 · **Paralela com:** — · **Depende de:** 10 · **Bloqueia:** 12, 14
**Label sugerido:** `ui` · **Esforço:** G

## Objetivo

Carrinho completo com persistência, disponibilidade, cupom e resumo vindo da API,
reativo a `nft.updated`.

## Subtasks

### 11.1 — Composição + CRUD de itens

- Frames `11:1278` (desktop) / `16:360` (mobile): adicionar/alterar quantidade/remover
  respeitando `available` (`409 INSUFFICIENT_STOCK` → manter valor válido + limite)

### 11.2 — Persistência e sessão

- Itens sobrevivem a refresh · carrinho do visitante preservado ao autenticar

### 11.3 — Cupom

- `CouponInput` aplicar/remover; `COUPON_INVALID` (erro no input) e `COUPON_EXPIRED`
  (mensagem + remoção automática) conforme `docs/api/quote.md`

### 11.4 — Resumo do `Quote`

- Subtotal, desconto, taxa de rede, total vindos da API — cálculo local só como
  feedback entre refetchs (`lib/money.ts`); skeleton do resumo

### 11.5 — Reatividade (`nft.updated`)

- Aviso "preço alterado de X para Y" + novo subtotal (`aria-live`) reagindo ao evento
  do socket pelas regras de versão (`ARCHITECTURE.md` §5)

### 11.6 — Estados

- Skeleton shimmer · carrinho vazio (CTA ao catálogo) · erro com retry

## Critérios de aceite (gate)

- [ ] Cenários `cupom-ruim` e `preco-muda` comportam-se na UI
- [ ] `pnpm typecheck && pnpm lint` verdes

## Referências

- `docs/api/cart.md`, `docs/api/quote.md` · `ARCHITECTURE.md` §5.3 · frames `11:1278`/`16:360`
