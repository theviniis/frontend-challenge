# Plano de Execução — Desafio GreenMint NFT Marketplace

Passo a passo para entregar o teste. Cada fase termina com uma **gate de verificação**
que precisa passar antes da próxima. Status: `[x]` concluído · `[ ]` pendente.

> **Tarefas granulares para o Linear:** `docs/tarefas/` — 20 issues com dependências,
> ondas de paralelismo e critérios de aceite (`docs/tarefas/00-INDICE.md` é o mapa).

---

## Fase 0 — Fundação de definição ✅

- [x] Enunciado lido e escopo mapeado (`README.md` — 9 telas, critérios, eliminatórios)
- [x] Arquivo Figma inspecionado: 9 frames desktop + 6 mobile (414px), tokens extraídos
- [x] `docs/ESTRUTURA.md` — árvore de pastas, mapa das 10 rotas, scripts, fases
- [x] `docs/ESTILOS.md` — cores, tipografia (Roboto Mono), componentes, breakpoints
- [x] `docs/api/` — contratos REST (9 arquivos: convenções + 8 recursos)
- [x] `ARCHITECTURE.md` — sessão, cache, dinheiro, idempotência, socket, erros
- [x] `docs/MOCKS.md` — 18 cenários, transporte Socket.IO, controle em testes
- [x] `AGENTS.md` — regras e comandos para sessões de agente
- [x] `routes.md` — prompt para criar a camada de rotas
- [x] `.opencode/commands/mocks.md` — comando `/mocks` (mocks + testes de contrato)

**Pendência de ambiente (opcional):** corrigir `FIGMA_API_KEY` em
`~/.config/opencode/opencode.json` (hoje `FIGMA_PERSONAL_ACCESS_TOKEN`) e reiniciar a
sessão para ativar o MCP do Figma — a REST API já funciona com o token atual.

---

## Fase 1 — Scaffolding (fundação técnica)

Referência: `docs/ESTRUTURA.md` §1–2 e §7 · `docs/ESTILOS.md` §1–3

- [x] Criar app Vite + React 19 + TypeScript strict com **pnpm** (lockfile versionado)
- [x] Tailwind CSS v4: mapear os tokens de `docs/ESTILOS.md` para `@theme`
      (20 cores, escala tipográfica `text-*`, raios, fonte Roboto Mono auto-hospedada)
- [x] shadcn/ui inicializado e adaptado ao tema (button, input, dialog, sheet, skeleton…)
- [x] Instalar stack: TanStack Router (plugin file-based) + Query, Axios, zod, decimal.js,
      MSW, socket.io-client, @mswjs/socket.io-binding, react-hook-form, vitest
- [x] Criar a árvore de pastas (`src/routes`, `features/*` vazias, `lib/{http,query,socket,session}`, `components/{ui,layout,shared}`, `mocks/`)
- [ ] `lib/http/client.ts` (Axios + interceptors) · `lib/query/client.ts` + `keys.ts` ·
      `lib/money.ts` (decimal.js) · `lib/http/errors.ts` (`AppError`)
- [ ] Bootstrap do MSW no `main.tsx` (`VITE_MOCKS` com import dinâmico) + `browser.ts`
- [ ] Scripts do `package.json`: `dev`, `build`, `preview`, `typecheck`, `lint`, `test:contract`,
      `test:e2e`, `lighthouse`, `fig:extract`
- [ ] ESLint + Prettier · `.env.example` (`FIGMA_TOKEN`, `VITE_MOCKS`, `VITE_MOCK_SCENARIO`)
- [ ] `pnpm fig:extract` → PNGs dos NFTs em `public/assets/nft/`, ícones SVG em `public/icons/`,
      JSON de referência em `docs/figma/`

**Gate:** `pnpm build && pnpm typecheck && pnpm lint` verdes · app abre com tema correto.

---

## Fase 2 — Rotas

Prompt pronto: **`routes.md`** (raiz). Para usar como comando: copiar para
`.opencode/commands/routes.md` e rodar `/routes`, ou colar o conteúdo em uma sessão.

- [ ] Executar o prompt → 10 arquivos de rota + `__root.tsx` + `errorComponent`
- [ ] `lib/session/guards.ts` com `requireSession` (4 rotas privadas, só `beforeLoad`)
- [ ] `validateSearch` zod: catálogo (`q/categories/minPrice/maxPrice/sort/page`), `?qty=`, `?redirect=`

**Gate:** checklist do `routes.md` §3 — URL direta + refresh em todas as rotas,
redirect de privada com `?redirect=` ida/volta, `/?q=abc&page=2` sobrevive, `*` → 404.

---

## Fase 3 — Mocks + testes de contrato

Comando pronto: **`/mocks`** (`.opencode/commands/mocks.md`) — ler o prompt e executar.

- [ ] Schemas zod (fonte única) + 8 handlers REST completos + `_mock` (reset/scenario/emit)
- [ ] DB com persistência `gm_db_v1` + reset determinístico
- [ ] Fixtures: 60+ NFTs, 2 usuários, 4 cupons, carteiras, pedidos seed
- [ ] 18 cenários de `docs/MOCKS.md` §4 + latências determinísticas
- [ ] Socket.IO (`@mswjs/socket.io-binding`): `nft.updated` / `order.updated` disparados por mutações e timers
- [ ] Switcher dev-only + testes de contrato (Vitest + `setupServer`)

**Gate:** `pnpm test:contract` verde · `?scenario=lento|offline|sessao-expirada` comprova
comportamento · reset 2× = mesmo estado · grep sem importação de mocks fora da rede.

---

## Fase 4 — Catálogo (Início)

Referência: `docs/api/nfts.md` · `docs/ESTRUTURA.md` §6.2 · frames `2:2` / `14:5226`

- [ ] Busca, filtros combináveis, ordenação e paginação com estado na URL (sobrevive a refresh/histórico)
- [ ] Grid + `NFTCard` com skeletons shimmer (dimensões preservadas, `prefers-reduced-motion`)
- [ ] Estados: loading · vazio (com "limpar filtros") · erro (retry) · sucesso · refetch em background
- [ ] Destaques/novidades conforme composição do Figma

**Gate:** trocar filtro reseta `page` · resposta fora de ordem descartada · `pnpm lint/typecheck`.

---

## Fase 5 — Detalhes do NFT + favoritos

Frames `10:244` / `15:5536` · `docs/api/nfts.md`, `docs/api/favorites.md`

- [ ] Acesso direto, NFT inexistente (404 amigável), edição indisponível, limite de quantidade
- [ ] Galeria, informações, `QuantityStepper` com limites, compra → carrinho
- [ ] Favorito com **otimismo** (cancel → snapshot → apply → rollback) e guard de auth

---

## Fase 6 — Conta e sessão

Frames `9:115`/`9:1022`/`16:1022`/`16:1228` · `docs/api/session.md` · `ARCHITECTURE.md` §2

- [ ] Cadastro (validação local + `409 CONFLICT` da API), login com `?redirect=`
- [ ] Sessão persistente: hidratação no boot, expiração tratada na navegação e no checkout
      (rascunho `gm_checkout_draft`), logout/troca de usuário limpando cache privado
- [ ] Merge do carrinho visitante no login · isolamento de dados por usuário

**Gate:** fluxo login → rota protegida → logout → login com outro usuário sem vazamento
(protegido pelo teste E2E da fase 12).

---

## Fase 7 — Carrinho

Frames `11:1278` / `16:360` · `docs/api/cart.md` + `quote.md`

- [ ] Adicionar/alterar/remover respeitando `available` · persistência após refresh/login
- [ ] Cupom (inválido/expirado) · subtotal/desconto/taxa/total vindos do `Quote`
- [ ] Reagir a `nft.updated` (aviso de preço + resumo atualizado, `aria-live`)

---

## Fase 8 — Pagamento + confirmação

Frames `11:2862`/`16:748` + `11:4385` · `docs/api/orders.md` · `ARCHITECTURE.md` §6

- [ ] Formulário do colecionador + seleção de carteira/rede + simulação de conexão (recusa/desconexão)
- [ ] Revisão antes do envio · `Idempotência-Key` persistida (`gm_pending_order`),
      botão anti-clique-duplo, retry manual reutilizando a chave
- [ ] Estados do pedido: pendente → confirmado/recusado via `order.updated`; recibo = snapshot
- [ ] Confirmação renderizada **só** com `status === "confirmed"` · carrinho limpa só o comprado
- [ ] `QUOTE_STALE` exige nova confirmação

**Gate:** cenários `preco-muda`, `timeout-pedido` e `pagamento-recusado` de `docs/MOCKS.md`
comportam-se na UI.

---

## Fase 9 — Perfil + carteiras (desktop e mobile)

Frames `9:1238` / `9:1670` (mobile sem frame → seguir padrão 414px) · `docs/api/profile.md`, `wallets.md`

- [ ] Edição de dados, avatar (preview + limite 512KB), alteração de senha com erros por campo
- [ ] Cadastro/edição de carteiras principal e secundária (conflitos `409`, validação de endereço)
- [ ] Variantes mobile das três telas sem frame

---

## Fase 10 — Tempo real + cenários de falha (integração UI)

`ARCHITECTURE.md` §5 · `docs/MOCKS.md` §4 e §6

- [ ] Cliente socket com dedupe por `version` · reconciliação REST na reconexão
- [ ] Listeners liberados no cleanup · escopo de sessão (evento de outro usuário ignorado)
- [ ] Cenário obrigatório: preço muda com item no carrinho → aviso → checkout bloqueado
- [ ] Queda com pedido pendente → refresh/reconexão recupera sem duplicar compra
- [ ] Percurso pelos 18 cenários verificando estados de erro/recuperação da UI

---

## Fase 11 — Acessibilidade e responsividade

`README.md` §8 · `docs/ESTILOS.md` §5–6

- [ ] Teclado/foco visível, foco em diálogos/drawers, labels + `aria-describedby` em erros
- [ ] Feedback acessível (`aria-live`) para mutations e eventos em tempo real
- [ ] Layouts 390 / 768 / 1440 sem overflow horizontal · zoom 200% sem perda

---

## Fase 12 — Testes E2E (Playwright)

`README.md` §9 · `docs/MOCKS.md` §8

- [ ] Config: projects desktop (1440) + mobile (390), traces on-failure, report HTML
- [ ] 12 specs (um por fluxo do enunciado), cada um com reset + cenário isolado
- [ ] Controle de relógio (`page.clock`), eventos via `POST /api/_mock/emit`
- [ ] Regressão visual: início, detalhe, carrinho, pagamento (baselines versionadas)

**Gate:** `pnpm test:e2e` verde de ponta a ponta.

---

## Fase 13 — Lighthouse, documentação e deploy

`README.md` §10 e §12

- [ ] `pnpm lighthouse`: início + detalhe, perfis mobile/desktop, 3 medições → mediana;
      metas P ≥90, A ≥95, BP ≥95, SEO ≥90 · justificar abaixo das metas (LCP/CLS/TBT)
- [ ] Config da auditoria versionada em `audits/` + relatórios HTML/JSON
- [ ] Mover o enunciado (ex.: `docs/DESAFIO.md`) e escrever o **README.md da solução**:
      setup, variáveis, credenciais fictícias, cenários/reset, comandos, fluxos de falha
      (atualizar o ponteiro do `AGENTS.md` se o enunciado mudar de lugar)
- [ ] Completar `ARCHITECTURE.md` §9–10 (desvios do Figma, limitações, decisões de UX)
- [ ] Deploy (Vercel) com mocks ativos, acesso direto e refresh funcionando

---

## Fase 14 — Revisão final

`README.md` §11 — matar os eliminatórios e pontuar:

- [ ] Stack obrigatória em uso efetivo (não só instalada)
- [ ] Fluxos completos (não visuais) · confirmação só com resposta da simulação
- [ ] Zero vazamento de dados entre usuários · eventos só pelo cliente Socket.IO
- [ ] E2E executáveis de ponta a ponta · deploy público acessível
- [ ] Revisar os 100 pontos da tabela item a item antes de enviar

---

## Comandos de verificação (usar em toda fase)

```bash
pnpm typecheck && pnpm lint     # sempre antes de concluir uma tarefa
pnpm test:contract              # após tocar em mocks/contratos
pnpm test:e2e                   # após tocar em fluxos
pnpm build                      # antes do deploy
```

## Onde estão os insumos

| Preciso de…                  | Arquivo                                  |
| ---------------------------- | ---------------------------------------- |
| Estrutura/rotas/fases        | `docs/ESTRUTURA.md`                      |
| Cores/tipografia/componentes | `docs/ESTILOS.md`                        |
| Contratos REST               | `docs/api/`                              |
| Sessão/cache/socket/dinheiro | `ARCHITECTURE.md`                        |
| Cenários MSW/testes          | `docs/MOCKS.md`                          |
| Regras para agentes          | `AGENTS.md`                              |
| Prompt das rotas             | `routes.md`                              |
| Prompt dos mocks             | `.opencode/commands/mocks.md` (`/mocks`) |
