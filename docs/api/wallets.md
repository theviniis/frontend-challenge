# Contrato — Carteiras

Endpoints 🔒, isolados por usuário. O layout prevê **no máximo duas** carteiras:
**principal** e **secundária**.

## Modelo

```ts
type Wallet = {
  id: string;              // "wal_ana_principal"
  label: string;           // apelido da carteira ("Carteira principal")
  address: string;         // "0x…" (40 hex)
  network: "ethereum" | "sepolia";
  isPrimary: boolean;      // exatamente um (ou nenhum)
  ensName?: string;        // "ana.eth"
  note?: string;           // "Observação do colecionador"
  createdAt: string;
};
```

## Endpoints

### `GET /api/wallets` 🔒

```jsonc
// 200 OK
{ "items": [ /* Wallet[] — no máx. 2 */ ] }
```

### `POST /api/wallets` 🔒 — cadastrar

```jsonc
// request
{
  "label": "Carteira principal",
  "address": "0xAbC…40hex",
  "network": "ethereum",
  "isPrimary": true,
  "ensName": "ana.eth",     // opcional
  "note": "…"                // opcional
}
// 201 Created → Wallet
```

| Status | `code` | Quando / UI |
| ---: | --- | --- |
| 409 | `CONFLICT` | endereço já cadastrado pelo usuário (`fields.address`) — mesmo endereço em outra rede também conflita |
| 409 | `CONFLICT` | já existem 2 carteiras (`fields.form`: "Limite de duas carteiras atingido") |
| 422 | `VALIDATION_ERROR` | endereço fora do padrão `0x`+40 hex, `label` vazio, rede inválida |

### `PATCH /api/wallets/:id` 🔒 — editar

```jsonc
// request (parcial)
{ "label": "Principal", "note": "…", "isPrimary": true, "network": "sepolia" }
// 200 OK → Wallet
```

| Regra | Detalhe |
| --- | --- |
| Promover a principal | `isPrimary: true` **inverte** a anterior (a secundária vira principal) — transação única no mock |
| Rede | atualizar `network` é permitido; se houver pedido pendente vinculado, responder `409 CONFLICT` (evita mudar rede durante checkout) |
| Endereço | **não editável** — para mudar, o usuário cadastra outra (remoção fora do escopo do layout; se solicitada, responder `403`) |

Erros: `404 NOT_FOUND` (id inexistente), `403 FORBIDDEN` (carteira de outro usuário —
mesma convenção dos pedidos), `409 CONFLICT`, `422 VALIDATION_ERROR`.

## Fluxo no checkout

1. `GET /api/wallets` popula o seletor de carteira (vazio → CTA "Cadastre em Carteiras").
2. Usuário escolhe carteira + rede (`select` com `ethereum`/`sepolia`).
3. **Simulação de conexão** (client-side, sem blockchain): estados
   `disconnected → connecting → connected | rejected`, com botão "Desconectar".
   `rejected` bloqueia o envio; `disconnected` durante o envio → bloquear e pedir reconexão.
4. Carteira selecionada + rede escolhida entram no `POST /api/orders`.
