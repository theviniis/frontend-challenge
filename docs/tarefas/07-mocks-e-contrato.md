# 07 — Camada de mocks + testes de contrato

**Onda:** 3 · **Paralela com:** `06-rotas` · **Depende de:** 04, 05 · **Bloqueia:** 08, 09
**Label sugerido:** `mocks` · **Esforço:** G

## Objetivo

Executar o comando **`/mocks`** (`.opencode/commands/mocks.md`): implementar toda a
camada de dados simulados (REST + Socket.IO + cenários) e os testes de contrato que a
validam contra `docs/api/`.

## Como executar

- Rodar `/mocks` em sessão do opencode (ou colar o conteúdo do comando).

## Subtasks

### 07.1 — Schemas zod (fonte única)

- Schemas de request/response usados por handlers **e** testes; `types/api.ts` re-exporta

### 07.2 — Handlers REST (8 recursos)

- session, nfts, favorites, cart, quote, orders, profile, wallets — envelope de erro e
  códigos de `docs/api/README.md` §3, idempotência de pedido (replay → mesmo pedido;
  payload divergente → `409`), merge de carrinho no login, isolamento por token/anon

### 07.3 — Endpoints de controle + switcher

- `handlers/mock-control.ts`: `POST /api/_mock/reset`, `GET/POST /api/_mock/scenario`,
  `POST /api/_mock/emit`
- Switcher dev-only (cenário/status/reset) montado só com `DEV` ou `VITE_MOCK_UI=1`

### 07.4 — DB persistente + reset

- Store em memória hidratado de `gm_db_v1`, sincronizado a cada mutação,
  reset determinístico ao seed

### 07.5 — Fixtures

- 60+ NFTs (≥5 categorias, 0.02–12.30 ETH, 4 imagens), 2 usuários
  (`ana@greenmint.test`/`Ana12345`, `bruno@greenmint.test`/`Bruno1234`),
  4 cupons (`LAUNCH10`, `GREEN5`, `EXPIRED`, `FAKE`), carteiras da Ana,
  pedidos seed (1 confirmed + 1 pending)

### 07.6 — Cenários determinísticos

- Os 18 de `docs/MOCKS.md` §4 com latência fixa por cenário; seleção por
  env/`?scenario=`/switcher na precedência da §3

### 07.7 — Socket.IO (eventos + timers)

- `@mswjs/socket.io-binding`: `nft.updated`/`order.updated` no formato
  `ARCHITECTURE.md` §5.1 emitidos **por mutações REST** + timers dos cenários
  (`preco-muda`, `pagamento-*`, `timeout-pedido`)

### 07.8 — Testes de contrato (Vitest)

- `tests/contract/*.spec.ts`: `setupServer()` + Axios do projeto, validação por schema zod,
  happy path × erros por recurso + cenários-chave (replay idempotente, `QUOTE_STALE`,
  cupom, sessão expirada, 404, estoque); `beforeEach` com reset; script `test:contract`

## Critérios de aceite (gate) — §4 do comando `/mocks`

- [ ] `pnpm typecheck && pnpm lint && pnpm test:contract` verdes
- [ ] `?scenario=lento|offline|sessao-expirada` comprova comportamento no `pnpm dev`
- [ ] Reset 2× → mesmo estado · grep sem import de mocks fora da camada de rede

## Referências

- `.opencode/commands/mocks.md` · `docs/MOCKS.md` · `docs/api/` · `ARCHITECTURE.md`
