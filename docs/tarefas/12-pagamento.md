# 12 — Tela Pagamento + confirmação (recibo)

**Onda:** 7 · **Paralela com:** `13-perfil-carteiras` · **Depende de:** 09, 11 · **Bloqueia:** 14, 15, 16
**Label sugerido:** `ui` · **Esforço:** G

## Objetivo

Checkout completo com revisão, carteira/rede, idempotência e estados do pedido;
tela de confirmação só para pedido efetivamente confirmado.

## Subtasks

### 12.1 — Composição das telas

- Frames `11:2862`/`16:748` (pagamento) e `11:4385` (confirmação/recibo)

### 12.2 — Dados + carteira/rede + conexão simulada

- Dados do colecionador, seleção de carteira e rede (seed da API)
- Simulação: `disconnected → connecting → connected | rejected` + desconectar;
  `rejected`/`disconnected` bloqueiam o envio

### 12.3 — Revisão + idempotência

- Revisão antes do envio (itens, cupom, totais, carteira, rede)
- `Idempotency-Key` persistida (`gm_pending_order`); botão `disabled` + `aria-busy`
  durante envio (clique repetido não dispara 2ª chamada)
- Timeout/erro → retry manual reutiliza a **mesma chave** (recupera o mesmo pedido)

### 12.4 — Revalidação (`QUOTE_STALE`)

- `409 QUOTE_STALE` → refetch da cotação + **nova confirmação do usuário**

### 12.5 — Estados do pedido + recibo

- Pendente/confirmado/recusado via `order.updated` (+ polling de segurança);
  confirmação renderiza **só** com `status === "confirmed"`
- Recibo = snapshot (itens, taxas, total, `txHash`/link explorador simulados)
- `declined` mostra `declineReason` e mantém o carrinho

### 12.6 — Limpeza do carrinho + expiração

- Após `confirmed`: remover **só** itens/quantidades comprados
- Expiração no meio do checkout → login → retomada com rascunho

## Critérios de aceite (gate)

- [ ] Cenários `timeout-pedido`, `pagamento-recusado`, `preco-muda` com portas de saída corretas
- [ ] Refresh com pedido pendente recupera estado sem duplicar compra
- [ ] `pnpm typecheck && pnpm lint` verdes

## Referências

- `docs/api/orders.md` · `ARCHITECTURE.md` §5–6 · `docs/MOCKS.md` §4 · frames citados
