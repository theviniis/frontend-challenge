# AGENTS.md — GreenMint NFT Marketplace

Desafio frontend de um marketplace de NFTs (React + TypeScript). Este arquivo é a
referência rápida para sessões de agente; detalhes estão nos docs indicados ao final.

## Comandos

> Válidos após o scaffolding (fase 1). Gerenciador: **pnpm**.

| Comando                              | O que faz                                                         |
| ------------------------------------ | ----------------------------------------------------------------- |
| `pnpm dev`                           | dev server com mocks MSW ativos                                   |
| `pnpm build` / `pnpm preview`        | build de produção / preview local                                 |
| `pnpm typecheck`                     | `tsc --noEmit`                                                    |
| `pnpm lint` / `pnpm lint:fix`        | ESLint + Prettier                                                 |
| `pnpm test:contract`                 | Vitest — handlers MSW validados contra os schemas zod             |
| `pnpm test:e2e` / `pnpm test:e2e:ui` | Playwright (Chromium desktop 1440 + mobile 390)                   |
| `pnpm lighthouse`                    | auditoria Lighthouse (3 medições/página/perfil)                   |
| `pnpm fig:extract`                   | exporta frames/estilos/ícones do Figma → `docs/figma/`, `public/` |
| `pnpm format`                        | formata arquivos com prettier                                     |

**Antes de concluir qualquer tarefa:** rodar `pnpm typecheck` e `pnpm lint`.
Depois de tocar em testes/fluxos: `pnpm test:e2e` nos specs afetados.

## Regras do projeto

1. **Stack obrigatória (não substituir):** Vite, React, TypeScript (strict),
   TanStack Router (file-based), TanStack Query, Axios, Tailwind CSS v4, shadcn/ui,
   MSW, Socket.IO (`socket.io-client`), Playwright.
2. **Camada de rede:** toda chamada REST passa por `src/lib/http` (Axios) e todo evento
   em tempo real por `src/lib/socket`. Mocks existem apenas em `src/mocks/` — nunca
   resposta fictícia, `fetch` direto ou branch de negócio dentro de componente/hook.
3. **Dinheiro:** valores ETH são **string decimal** e só são calculados em
   `src/lib/money.ts` (decimal.js). Proibido `number`/`parseFloat` em valores monetários.
4. **Contratos:** os shapes de API estão em `docs/api/`; tipos do cliente derivam de
   zod (`z.infer`). Mudança de contrato = alterar o doc **e** o schema junto.
5. **Rotas privadas** (`checkout`, `orders/:id`, `profile`, `wallets`) são protegidas
   por `beforeLoad` com redirect `?redirect=` — não duplicar guard em componente.
6. **Query keys** sempre pela factory em `src/lib/query/keys.ts`, incluindo `userId`
   (`"anon"` quando visitante). Mutations seguem a tabela de invalidação do
   `ARCHITECTURE.md` §3.3; otimismo segue o molde cancel→snapshot→apply→rollback.
7. **Eventos socket:** aplicar só se `version > última conhecida`; nunca efeito direto
   na UI sem passar pelo cliente em `lib/socket` (critério eliminatório do desafio).
8. **Estados de dados:** toda tela que consome dados precisa de loading (skeleton
   shimmer), vazio, erro (retry) e sucesso — ver padrões em `docs/ESTILOS.md` §5.
9. **Acessibilidade:** foco visível sempre, labels/erros associados (`aria-describedby`),
   feedback de mutations/anúncios `aria-live`, suporte a `prefers-reduced-motion`.
10. **Testes:** cada spec parte de estado isolado (`POST /api/_mock/reset` + cenário via
    `addInitScript`); nunca depender da ordem de execução entre specs.

11. **Estilização:** o único arquivo CSS do projeto é `src/styles/global.css` (imports, tokens, tema, estilos base e animações compartilhadas). Use Tailwind inline em `className`; utilitários personalizados e novos componentes compartilhados somente com reutilização concreta. Não criar CSS por componente ou feature.

12. **Classes canônicas do Tailwind:** sempre verificar os diagnósticos informativos
    e warnings `tailwindcss(suggestCanonicalClasses)` ao criar ou alterar estilos.
    Substituir classes arbitrárias pelas classes canônicas sugeridas quando forem
    equivalentes no tema configurado (ex.: `leading-[23px]` → `leading-5.75` e
    `rounded-[6px]` → `rounded-default`). Manter valores arbitrários somente quando
    não houver equivalente canônico. Essa verificação complementa o lint; não
    presumir que o ESLint verifica esses diagnósticos do Tailwind IntelliSense.

## Decisões já tomadas (não rediscutir sem motivo)

- Tema visual: dark quente (`#140D0A` base), texto `#F5F1EB`, primário `#D28A4C`,
  tipografia **Roboto Mono** (auto-hospedada) — tokens em `docs/ESTILOS.md`.
- Estrutura **feature-first** + rotas file-based — árvore em `docs/ESTRUTURA.md`.
- Sessão: token opaco em `localStorage gm_session`, 2h, sem refresh silencioso.
- Pedido: chave de idempotência persistida (`gm_pending_order`); confirmação só com
  `status === "confirmed"` vindo da simulação.
- Cenários de mock selecionáveis (env/URL/switcher) — catálogo em `docs/MOCKS.md`.

## Onde ler antes de mexer em algo

| Assunto                                      | Arquivo                                 |
| -------------------------------------------- | --------------------------------------- |
| Estrutura de pastas, rotas, scripts, fases   | `docs/ESTRUTURA.md`                     |
| Cores, tipografia, componentes reutilizáveis | `docs/ESTILOS.md`                       |
| Contratos REST (endpoints, erros, modelos)   | `docs/api/README.md` (+ resource files) |
| Sessão, cache, tempo real, dinheiro, erros   | `ARCHITECTURE.md`                       |
| Cenários MSW, Socket.IO no mock, Playwright  | `docs/MOCKS.md`                         |
| Enunciado do desafio (critérios, entregas)   | `README.md`                             |
