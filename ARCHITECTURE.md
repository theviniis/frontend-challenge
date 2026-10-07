# Arquitetura — GreenMint NFT Marketplace

Documento normativo da solução: políticas de sessão, cache, tempo real, dinheiro e erros.
Contratos REST: [`docs/api/`](./docs/api/README.md) · Estrutura: [`docs/ESTRUTURA.md`](./docs/ESTRUTURA.md) ·
Estilo: [`docs/ESTILOS.md`](./docs/ESTILOS.md) · Mocks/cenários/testes: [`docs/MOCKS.md`](./docs/MOCKS.md).

## 1. Visão geral das camadas

```
┌──────────────────────────────────────────────────────────────┐
│ src/routes/          file-based routes (TanStack Router)     │
│   · validateSearch (zod)  · beforeLoad (guards privados)     │
├──────────────────────────────────────────────────────────────┤
│ src/features/*       UI + orquestração por domínio           │
│   · components/ hooks/ queries.ts (único ponto p/ Axios)     │
├────────────────────────────┬─────────────────────────────────┤
│ src/lib/query              │ src/lib/session                 │
│  QueryClient, keys, retry  │ token, expiração, guards        │
├────────────────────────────┼─────────────────────────────────┤
│ src/lib/http (Axios)       │ src/lib/socket (socket.io)      │
│  interceptors, AppError    │  eventos, version, reconcile    │
├────────────────────────────┴─────────────────────────────────┤
│ Camada de rede: MSW (handlers REST + socket.io-binding)      │
│  dev/demo/teste — idêntica; nunca dentro de componente/hook  │
└──────────────────────────────────────────────────────────────┘
```

Regras de dependência: `routes → features → lib → (axios | socket)`. Componentes nunca
importam Axios nem socket diretamente; mocks nunca são importados pelo app (ficam atrás da rede).

## 2. Sessão e autenticação

| Aspecto | Decisão |
| --- | --- |
| Credencial | `token` opaco (`mock.…`) devolvido por login/signup |
| Persistência | `localStorage gm_session = { token, user, expiresAt }` |
| Expiração | 2h no mock; verificada no boot (`GET /auth/session`) e por interceptor em 401 |
| Guard das rotas privadas | `beforeLoad` → sem sessão válida: `redirect({ to: '/login', search: { redirect: <url atual> } })` |
| Retorno ao fluxo | `/login?redirect=/checkout?draft=…`; após login, `router.navigate` ao redirect validado (só rotas internas — evitar open redirect) |
| Expiração durante checkout | rascunho do formulário salvo em `localStorage gm_checkout_draft`; 401 → login → retorna ao checkout com rascunho restaurado |
| Logout / troca de usuário | `queryClient.removeQueries({ queryKey: keyFactory.all })` (prefixo do usuário), limpar `gm_session`, `gm_pending_order` e dados privados do socket, desconectar/reautenticar o socket |
| Isolamento | query keys incluem `userId`; favoritos/carrinho/perfil/carteiras/pedidos nunca compartilham cache entre usuários |
| Visitante | `X-Anonymous-Id` (`gm_anon_id`); no login a API funde o carrinho visitante; no logout o cliente volta ao carrinho anônimo vazio |

**Política de reautenticação:** o cliente NÃO renova token silenciosamente (não há refresh
token). Expiração = sessão nova explícita, com contexto preservado.

## 3. Estratégia de cache (TanStack Query)

### 3.1 Defaults (`lib/query/client.ts`)

| Query | `staleTime` | `gcTime` | `refetchOnWindowFocus` | `retry` |
| --- | ---: | ---: | --- | --- |
| Catálogo, detalhe, favoritos, perfil, carteiras | 30s | 5min | sim | 2× backoff exponencial (1s, 2s) — só GET |
| Carrinho, cotação | **0** | 5min | sim | 2× (idempotente) |
| Pedido `pending` | 0 | 10min | sim | 2× |
| Pedidos terminais (`confirmed`/`declined`) | ∞ (snapshot) | 10min | não | 1× |

- `retry: 0` para **qualquer mutation** — novas tentativas são explícitas na UI (botão
  "Tentar novamente"), nunca automáticas (evita duplicar operações).
- `networkMode: 'online'` default; em `ErrorState` exibir retry manual.

### 3.2 Query keys (`lib/query/keys.ts` — factory única)

```ts
keyFactory.nfts.all                    // ["nfts"]
keyFactory.nfts.list(searchParams)     // ["nfts", "list", { q, categories, sort, page, … }] ← hash da URL
keyFactory.nfts.detail(id)             // ["nfts", "detail", id]
keyFactory.favorites.all(userId)       // ["favorites", userId]
keyFactory.cart(userId)                // ["cart", userId]
keyFactory.quote(userId, coupon)       // ["quote", userId, coupon ?? null]
keyFactory.order(userId, id)           // ["order", userId, id]
keyFactory.profile(userId)             // ["profile", userId]
keyFactory.wallets(userId)             // ["wallets", userId]
```

`userId` = `session.user.id` ou `"anon"`. Params de busca entram **serializados igual à URL**
para que invalidação/igualdade funcionem.

### 3.3 Invalidação após mutations

| Mutation | O que fazer no sucesso |
| --- | --- |
| Favoritar/desfavoritar | otimista + rollback; `onSettled` → invalidate `favorites` (background) |
| Carrinho (add/update/remove) | invalidate `cart` + `quote` |
| Aplicar/remover cupom | invalidate `quote` |
| Login / signup | `queryClient.clear()` + invalidate prefixo do novo usuário; reconectar socket com novo token |
| Logout | §2 (removeQueries) |
| Editar perfil | invalidate `profile` |
| Carteiras | invalidate `wallets` |
| Criar pedido | invalidate `cart` (após confirmed), invalidate `quote`, `setQueryData` do pedido com a resposta |
| `nft.updated` (socket) | atualizar `setQueryData` de `nfts.detail` + merge nas listas visíveis (§5) |
| `order.updated` (socket) | `setQueryData` do pedido (se versão maior) |

### 3.4 Atualização otimista (obrigatória — favoritos)

```
onMutate:  cancelQueries(favorites) → snapshot → setQueryData(otimista)
onError:   setQueryData(snapshot) + toast de erro (feedback acessível)
onSettled: invalidate(favorites)
```
Qualquer outra otimismo adicionada depois deve seguir este molde (cancel → snapshot →
apply → rollback → invalidate).

### 3.5 Respostas fora de ordem

- `useQuery` com `queryKey` estável + `queryFn` com `signal` (Axios `AbortSignal`) →
  cancelamento automático ao mudar de página/filtro.
- Respostas antigas de mutações (ex.: `PATCH cart` A antes de B) são descartadas por
  `version` no corpo (`Cart.version`, `Nft.version`) — aplicar só se `> versão atual`.
- Nenhuma tela renderiza estado de "sucesso" sem passar por loading/erro/vazio mapeados.

## 4. Dinheiro e precisão

- Fronteiras (API, store, estado): **string decimal ETH** (`"0.99"`).
- Cálculos: `decimal.js` em `lib/money.ts` — `add/sub/mul/cmp/format/parse`.
- **Proibido** `number` para valores monetários (e `parseInt/parseFloat` de ETH).
- Exibição: `formatEth(v, { maxDecimals })` — preços de card com 2 casas
  (≥1 ETH) ou até 4 casas (<1 ETH, ex.: `0.02`); totais com até 4 casas; sempre `… ETH`.
- Quantidades: inteiro, com limites do servidor (`available`).
- A API é a referência final: totais exibidos vêm do `Quote`/`Order`.

## 5. Tempo real (Socket.IO)

### 5.1 Contrato de evento

```ts
type NftUpdated = {
  type: "nft.updated";
  resourceId: string;        // nftId
  version: number;           // crescente por recurso
  ts: string;
  payload: { price: string; available: number; previousPrice: string };
};

type OrderUpdated = {
  type: "order.updated";
  resourceId: string;        // orderId
  version: number;
  ts: string;
  payload: { status: "pending" | "confirmed" | "declined"; txHash?: string;
             explorerUrl?: string; declineReason?: string };
};
```

### 5.2 Regras do cliente (`lib/socket/`)

1. **Idempotência/ordem**: aplicar evento só se `version > últimaVersãoConhecida`;
   duplicatas e eventos antigos são ignorados (log em dev, sem efeitos).
2. **Escopo de sessão**: `order.updated` só é aplicado se o pedido pertence ao usuário
   atual (check por query key `order(userId, id)`); eventos da sessão anterior são descartados.
3. **Reconexão**: no `connect` (inclusive após queda), **reconciliar com REST**:
   refetch de `cart`, `quote`, listas de catálogo visíveis e de qualquer `order` pendente.
   Reconexão não cria nem duplica pedidos.
4. **Ciclo de vida**: assinaturas em `useEffect` com cleanup (`off` + `removeListener`);
   socket é singleton no `SocketProvider` (montado no root) — não há listener órfão.
5. **Pedido pendente + queda de conexão**: ao voltar, `GET /orders/:id` (id em
   `gm_pending_order`) decide o estado; terminais são definitivos.

### 5.3 Cenário obrigatório (preço muda durante checkout)

1. NFT no carrinho → evento `nft.updated` (disparado pelo handler MSW do cenário `preco-muda`).
2. UI informa a alteração (aviso + novo subtotal) via `setQueryData` + toast com `aria-live`.
3. `quoteVersion` muda → `POST /orders` responde `409 QUOTE_STALE`.
4. Checkout bloqueia a confirmação e exige revisão/nova confirmação do usuário.

## 6. Idempotência do pedido (cliente)

Fluxo completo em [`docs/api/orders.md`](./docs/api/orders.md). Síntese do lado do app:

- Gerar chave (`crypto.randomUUID()`) **antes** do primeiro envio e persistir em
  `gm_pending_order { key, payloadHash, orderId? }`.
- Envio usa `useMutation` com `networkMode`, sem retry automático; botão fica
  `disabled` + `aria-busy` durante o envio (**clique repetido não dispara 2ª chamada**).
- Timeout/erro de rede → botão "Tentar novamente" reenvia **com a mesma chave**.
- `409 IDEMPOTENCY_CONFLICT` → recuperar pedido existente pela chave e mostrar divergência.
- Sucesso `201/200` → persistir `orderId`, aguardar `status === "confirmed"` (socket ou polling
  do `GET`) antes de navegar ao recibo.
- Estado terminal ou descarte do usuário → limpar `gm_pending_order`.

## 7. Erros (`lib/http/errors.ts`)

```ts
type AppError =
  | { kind: "validation"; fields: Record<string, string[]> }
  | { kind: "http"; code: ApiErrorCode; message: string; fields?: … }   // envelope docs/api
  | { kind: "network"; message: string }                                // sem resposta
  | { kind: "canceled" };                                               // abort — silencioso
```

- Interceptor Axios mapeia `AxiosError → AppError`; `canceled` nunca vira toast/estado de erro.
- UX por `kind`: `validation` → campos; `http` → mapa da tabela de códigos (`docs/api/README.md` §3);
  `network` → `ErrorState` com retry.
- Toasts são anunciados (`role="status"` / `aria-live="polite"`); erros de campo usam
  `aria-invalid` + `aria-describedby`.

## 8. Mocks, cenários e testes

Definições em [`docs/MOCKS.md`](./docs/MOCKS.md): ativação, persistência/reset, os 10+ cenários
determinísticos, transporte Socket.IO via `@mswjs/socket.io-binding`, integração com Playwright
(cenário por teste, controle de relógio, baselines) e limitações do ambiente de simulação.

## 9. Decisões de UX e desvios do Figma

> Seção viva — registrar aqui, durante a implementação, qualquer substituição de asset,
> adaptação de componente ou desvio consciente em relação ao layout.

| Item | Decisão | Motivo |
| --- | --- | --- |
| Mobile de Perfil/Carteiras/Confirmação | sem frame no Figma — seguir padrão visual das telas mobile existentes (414px) | exigência do enunciado |
| Ícones Iconly | exportar SVGs reais do Figma (`fig:extract`) | fidelidade; lucide só como fallback documentado |
| Fonte | Roboto Mono auto-hospedada (fontsource) | Lighthouse (sem dependência de rede em runtime) |
| Páginas editoriais/suporte/atividade | links presentes no footer, mas **inertes** (sem navegação falsa, com `aria-disabled`/nota) | fora do escopo e não devem aparentar sucesso |
| Text/Primary (estilo legado do Figma) | não implementado — headings usam `Color/Foreground` | estilo descrito como legado no próprio arquivo |

## 10. Limitações conhecidas (atualizar na entrega)

- Sem blockchain real: carteiras, conexão e transações são simuladas (por escopo do desafio).
- Transporte Socket.IO via MSW — ver limitações em `docs/MOCKS.md` §6.
- Token de sessão opaco sem refresh — expiração sempre exige novo login.
