# 09 — Conta e sessão (cadastro, login, logout, guards)

**Onda:** 4 · **Paralela com:** `08-catalogo` · **Depende de:** 03, 06, 07 · **Bloqueia:** 10, 12, 13
**Label sugerido:** `ui` · **Esforço:** G

## Objetivo

Fluxos de autenticação completos com a API mockada, sessão persistente e guards já
configurados no 06 funcionando de ponta a ponta.

## Subtasks

### 09.1 — Tela de Login

- Frame `9:115`/`16:1022`: formulário, erros por campo + credenciais inválidas
  (mensagem única, sem revelar qual falhou), `?redirect=` de volta ao fluxo anterior

### 09.2 — Tela de Cadastro

- Frame `9:1022`/`16:1228`: validação local (zod) + `409 CONFLICT` no e-mail —
  `fields` da API vencem os erros locais

### 09.3 — Ciclo de sessão

- Hidratação no boot (`GET /auth/session`), persistência após refresh,
  `SESSION_EXPIRED` tratado durante a navegação → login com contexto

### 09.4 — Expiração no checkout + saída de sessão

- Rascunho em `gm_checkout_draft` e retomada após autenticar
- Logout: limpeza de cache privado (`removeQueries`), socket e `gm_session`
- Troca de usuário: nenhum dado do usuário anterior visível

### 09.5 — Merge do carrinho visitante

- Enviar `anonymousId` no login; itens do visitante fundidos no carrinho do usuário

### 09.6 — Acessibilidade dos formulários

- Labels, `aria-describedby`, `aria-invalid`, `aria-live` em erros e sucesso

## Critérios de aceite (gate)

- [ ] Fluxo: rota privada → login → volta à rota original → logout limpa tudo
- [ ] Sessão sobrevive a refresh · segundo usuário não vê dados do primeiro
- [ ] `pnpm typecheck && pnpm lint` verdes

## Referências

- `docs/api/session.md` · `ARCHITECTURE.md` §2 · frames `9:115`, `9:1022`, `16:1022`, `16:1228`
