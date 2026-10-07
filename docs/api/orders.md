# Contrato — Pedidos (criação idempotente, estado e recibo)

## Modelo

```ts
type OrderItem = {           // SNAPSHOT — congelado na criação
  nftId: string;
  name: string;
  image: string;
  edition: { current: number; total: number };
  qty: number;
  unitPrice: string;
  lineTotal: string;
};

type OrderStatus = "pending" | "confirmed" | "declined"; // terminais: confirmed/declined

type Order = {
  id: string;                       // "ord_01J…"
  status: OrderStatus;
  items: OrderItem[];
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
  currency: "ETH";
  coupon: { code: string; type: "percent" | "fixed"; value: number } | null;
  wallet: { id: string; label: string; address: string };
  network: string;                  // "ethereum" | "sepolia"
  txHash?: string;                  // presente em confirmed — 0x… simulado
  explorerUrl?: string;             // link simulado de exploração (externo, inerte)
  declineReason?: string;           // presente em declined — ex.: "Transação recusada pela carteira"
  quoteVersion: number;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  version: number;                  // dedupe do socket order.updated
};
```

## Endpoints

### `POST /api/orders` 🔒 — criar pedido

**Headers:** `Idempotency-Key: <uuid v4>` (obrigatório)

```jsonc
// request
{
  "coupon": "LAUNCH10",        // opcional — null/omitido = sem cupom
  "walletId": "wal_principal",
  "network": "ethereum",
  "quoteVersion": 12           // quoteVersion da cotação revisada pelo usuário
}
// 201 Created → Order { status: "pending" }
// 200 OK → Order existente (replay da mesma chave + mesmo payload)
```

Os **itens vêm do carrinho do servidor** (não do body) — o cliente não envia preços.

| Status | `code` | Quando / UI |
| ---: | --- | --- |
| 409 | `QUOTE_STALE` | preço/disponibilidade/cupom mudou desde `quoteVersion` → refetch cotação + **nova confirmação explícita** |
| 409 | `INSUFFICIENT_STOCK` | item esgotou → atualizar carrinho, bloquear envio |
| 409 | `IDEMPOTENCY_CONFLICT` | mesma chave com payload diferente → recuperar pedido da chave, nunca duplicar |
| 422 | `VALIDATION_ERROR` | `walletId`/`network`/`coupon` inválidos |
| 401 | `SESSION_EXPIRED` | expirou durante o checkout → salvar rascunho, redirecionar ao login, retomar após autenticar |
| 404 | `NOT_FOUND` | carteira inexistente |

### `GET /api/orders/:id` 🔒 — estado e recibo

```jsonc
// 200 OK → Order
// 404 NOT_FOUND | 403 FORBIDDEN (pedido de outro usuário)
```

Pendente → consultado após refresh/reconexão até alcançar estado terminal
(por polling pontual ou `order.updated`).

## Fluxo de vida do pedido

```
        POST (chave X)                 simulação (socket + estado)
       ┌──────────────┐               ┌──────────┐        ┌───────────┐
draft →│   pending    │──────────────▶│confirmed │   ou   │  declined │
       └──────────────┘  ~2-4s        └──────────┘        └───────────┘
             │  replay da chave X devolve o MESMO pedido (200)
             │  timeout sem resposta → reenvio com a mesma chave recupera o pedido
             ▼
      estados terminais são definitivos (nunca voltam a pending)
```

**Regras obrigatórias:**

1. **Anti-duplicidade**: a chave fica em `localStorage gm_pending_order`
   `{ key, payloadHash, orderId? }` até estado terminal ou descarte explícito do usuário.
   Clique repetido/timeout → reenvio com a MESMA chave; o mock responde `200` com o mesmo
   pedido. Chave reutilizada com payload diferente → `409 IDEMPOTENCY_CONFLICT`.
2. **Recuperação**: refresh com pedido pendente → `GET /orders/:id` pelo id persistido;
   sem id → replay por chave. Reconexão Socket.IO → refetch do pedido ativo.
3. **Confirmação só com simulação real**: a tela de confirmação só renderiza com
   `status === "confirmed"` vindo da API/socket — nunca após `201` isolado.
4. **Recibo = snapshot**: valores do pedido não mudam com o catálogo posterior.
   Links de exploração são simulados e marcados como externos/inertes.
5. **Limpeza do carrinho** acontece só após `confirmed`, removendo os itens/quantidades
   comprados; em `declined` o carrinho permanece intacto.
