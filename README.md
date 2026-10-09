# NFT Marketplace

Marketplace de NFTs desenvolvido como desafio frontend com React e TypeScript. A aplicação reúne catálogo, detalhes de NFTs, favoritos, carrinho, checkout, pedidos e conta do colecionador.

APIs, autenticação, carteiras e pagamentos são simulados. A demonstração funciona com mocks locais, sem backend externo ou transações reais em blockchain.

## Como rodar

Pré-requisitos: **Node.js 22.12 ou superior** e **pnpm 10.33.2**, versão indicada em `package.json`. O Vite instalado aceita Node `^20.19.0 || >=22.12.0`.

Após instalar o Node.js, instale a versão de pnpm utilizada pelo projeto:

```powershell
npm install --global pnpm@10.33.2
```

Na raiz do repositório, instale as dependências, copie a configuração de exemplo na primeira execução e inicie o ambiente de desenvolvimento:

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Em macOS/Linux, use `cp .env.example .env.local` para copiar o arquivo. Abra a URL exibida pelo Vite, normalmente `http://localhost:5173`.

Mantenha `VITE_MOCKS=true` e `VITE_API_BASE_URL` vazio para executar a demonstração local. Não é necessário configurar acesso ao Figma para rodar a aplicação.

Para gerar e visualizar o build:

```sh
pnpm build
pnpm preview
```

O valor de `VITE_MOCKS` é incorporado durante o build: mantenha-o como `true` em `.env.local` também para a versão de demonstração. Abra a URL indicada pelo preview, normalmente `http://localhost:4173`.

### Variáveis de ambiente

| Variável             | Uso                                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_MOCKS`         | Ativa MSW com `true`. O exemplo já habilita os mocks; sem configuração, Vite os habilita em desenvolvimento e desabilita no build. |
| `VITE_API_BASE_URL`  | URL base do cliente Axios. Deixe vazia para os mocks locais.                                                                       |
| `VITE_MOCK_SCENARIO` | Cenário inicial; vazio utiliza `padrao` quando não há seleção pela URL ou persistência.                                            |
| `VITE_MOCK_UI`       | `1` exibe o seletor de cenários no build de demonstração. Em desenvolvimento ele já aparece.                                       |
| `FIGMA_TOKEN`        | Token usado somente pelo script de extração do Figma.                                                                              |
| `FIGMA_FILE_KEY`     | Identificador do arquivo Figma; o exemplo contém a referência do desafio.                                                          |
| `FIGMA_VERSION`      | Versão opcional do arquivo para a extração.                                                                                        |

### Credenciais fictícias

| Usuário | E-mail                       | Senha       |
| ------- | ---------------------------- | ----------- |
| Ana     | `ana@nft-marketplace.test`   | `Ana12345`  |
| Bruno   | `bruno@nft-marketplace.test` | `Bruno1234` |

## Deploy na Vercel

Antes de publicar, confira os tipos, o lint e o build local:

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm preview
```

Crie um arquivo `vercel.json` na raiz do projeto com a configuração abaixo. Ela permite acesso direto e refresh de rotas da aplicação, como `/profile` e `/checkout`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Envie o código, incluindo `vercel.json` e `pnpm-lock.yaml`, para seu repositório Git. Na Vercel, importe o repositório como um novo projeto e confira as configurações:

| Configuração     | Valor                                                |
| ---------------- | ---------------------------------------------------- |
| Framework Preset | `Vite`                                               |
| Root Directory   | Raiz do projeto, onde está `package.json`.           |
| Install Command  | `pnpm install --frozen-lockfile`                     |
| Build Command    | `pnpm build`                                         |
| Output Directory | `dist`                                               |
| Node.js Version  | Versão 22.x compatível com o requisito mínimo 22.12. |

Configure as variáveis de ambiente na Vercel para os ambientes em que deseja disponibilizar a demonstração, como Production e Preview:

```dotenv
VITE_MOCKS=true
VITE_MOCK_SCENARIO=padrao
VITE_MOCK_UI=0
```

Deixe `VITE_API_BASE_URL` sem configuração para utilizar os mocks locais. Caso queira exibir o seletor de cenários na versão publicada, use `VITE_MOCK_UI=1`. O token do Figma não é necessário para o deploy.

Clique em **Deploy** e aguarde a conclusão do build. Abra a URL gerada e confira o carregamento do catálogo, login, checkout e acesso direto a uma rota interna com refresh. As APIs e os pagamentos continuam simulados no ambiente publicado.

As variáveis `VITE_*` são incorporadas ao build; depois de alterá-las na Vercel, faça um novo deploy para aplicar os valores.

Referências: [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite) e [publicação de aplicações Vite](https://vite.dev/guide/static-deploy.html).

## Arquitetura

A organização é **feature-first**: cada domínio concentra componentes, hooks e consultas em `src/features/`. As rotas ficam em `src/routes/`, os componentes compartilhados em `src/components/` e a infraestrutura em `src/lib/`.

```text
Rotas → Features → Clientes HTTP / Socket → Rede interceptada pelo MSW
                  ↕
             Cache do TanStack Query
```

- **Interface:** React, TypeScript strict, Tailwind CSS v4 e componentes shadcn/ui. O CSS do projeto está centralizado em `src/styles/global.css`.
- **Navegação:** TanStack Router com rotas baseadas em arquivos e divisão automática de código. Rotas privadas usam `beforeLoad`, com retorno ao fluxo via parâmetro `redirect`.
- **Estado remoto:** TanStack Query, com factory de query keys, isolamento dos dados privados por usuário, invalidação após mutations e atualização otimista de favoritos com rollback.
- **REST e contratos:** chamadas passam pelo Axios em `src/lib/http`. Schemas zod validam os contratos e fornecem os tipos inferidos do cliente.
- **Tempo real:** `socket.io-client` centralizado em `src/lib/socket`. Eventos de NFTs e pedidos são tratados por versão; a reconexão reconcilia os recursos com REST.
- **Mocks:** MSW intercepta REST e, com `@mswjs/socket.io-binding`, o transporte Socket.IO. Fixtures, persistência e cenários ficam em `src/mocks/`.
- **Sessão e compra:** sessão com token opaco persistido em `gm_session`, expiração de duas horas e sem refresh silencioso. Pedidos usam uma chave de idempotência persistida em `gm_pending_order`; a confirmação depende do estado `confirmed` da simulação.
- **Dinheiro:** valores ETH trafegam como strings decimais. Os cálculos ficam em `src/lib/money.ts`, com decimal.js, evitando perda de precisão com ponto flutuante.

As políticas detalhadas de sessão, cache, retries e reconciliação estão em [ARCHITECTURE.md](ARCHITECTURE.md).

## Cenários e reset dos mocks

Selecione um cenário com `?scenario=<id>` na URL ou pelo controle flutuante de desenvolvimento. A seleção também pode vir de `VITE_MOCK_SCENARIO`. A prioridade é URL, seleção em tempo de execução, cenário persistido, variável de ambiente e, por último, `padrao`.

Os dados simulados persistem localmente para permitir refresh. Use `?reset=1` para restaurar os dados iniciais, o botão de reset no seletor ou `POST /api/_mock/reset` nas ferramentas de teste. Para voltar ao cenário padrão e restaurar os dados, abra `/?scenario=padrao&reset=1`.

Exemplos, usando a URL local do servidor:

| Cenário            | Como reproduzir                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Carregamento lento | Abra `/?scenario=lento&reset=1` para observar os estados de carregamento.                                                            |
| Falha de rede      | Abra `/?scenario=offline&reset=1`. Para recuperar a demonstração, volte a `/?scenario=padrao&reset=1`.                               |
| Erro HTTP          | Abra `/?scenario=erro-5xx&reset=1` para simular falha no catálogo e detalhe.                                                         |
| Pagamento recusado | Abra `/?scenario=pagamento-recusado&reset=1`, entre com Ana, revise o carrinho e conclua o checkout para observar a recusa simulada. |

O catálogo completo, os gatilhos dos demais cenários e as limitações do transporte estão em [docs/MOCKS.md](docs/MOCKS.md).

## Comandos disponíveis

| Comando                              | Finalidade                                                                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `pnpm dev`                           | Servidor Vite de desenvolvimento.                                                                    |
| `pnpm build`                         | Verificação TypeScript e build de produção.                                                          |
| `pnpm preview`                       | Servidor local para visualizar o build.                                                              |
| `pnpm typecheck`                     | Verificação TypeScript com `tsc -b`.                                                                 |
| `pnpm lint` / `pnpm lint:fix`        | ESLint, sem ou com correções automáticas.                                                            |
| `pnpm format` / `pnpm format:check`  | Formatação ou conferência com Prettier.                                                              |
| `pnpm test:contract`                 | Testes de contrato com Vitest.                                                                       |
| `pnpm test:e2e` / `pnpm test:e2e:ui` | Testes Playwright, por terminal ou interface interativa.                                             |
| `pnpm lighthouse`                    | Auditoria de `http://localhost:5173/`, com saída em `report.html`; exige o servidor ativo nessa URL. |
| `pnpm fig:extract`                   | Extração de assets locais e referências do Figma para `public/` e `docs/figma/`.                     |

Antes da primeira execução E2E, instale o navegador:

```sh
pnpm exec playwright install chromium
pnpm test:e2e
```

O Playwright inicia seu próprio servidor com mocks, na porta `54123`, e possui projetos Chromium desktop (1440 × 900) e mobile (390 × 844). O relatório HTML pode ser aberto com `pnpm exec playwright show-report`; traces são mantidos em caso de falha.

A extração do Figma utiliza o arquivo local `Frontend Challenge.fig` e exige `FIGMA_TOKEN` para a etapa de consulta à API. Os assets necessários à aplicação já estão no repositório.

A existência desses comandos não representa comprovação de cobertura integral dos testes ou de cumprimento das metas de Lighthouse definidas no desafio.

## Páginas auxiliares

Além dos fluxos do marketplace, existem duas páginas públicas de apoio ao desenvolvimento, acessíveis diretamente pela URL:

| Rota      | Finalidade                                                                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/tokens` | Demonstração dos design tokens e componentes visuais utilizados pela interface.                                                                                          |
| `/teste`  | Página de experimentação dos parâmetros do catálogo na URL. Exibe os filtros atuais em JSON e permite testar busca, filtros, ordenação, paginação e limpeza dos filtros. |

Com o servidor de desenvolvimento na porta padrão, abra [Design Tokens](http://localhost:5173/tokens) ou [Teste de parâmetros](http://localhost:5173/teste). No deploy, utilize os mesmos caminhos na URL publicada.

## Documentação

| Documento                                                            | Conteúdo                                                       |
| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| [Arquitetura](ARCHITECTURE.md)                                       | Sessão, cache, dinheiro, erros e sincronização REST/Socket.IO. |
| [Estrutura](docs/ESTRUTURA.md)                                       | Organização de pastas, rotas e responsabilidades.              |
| [Estilos](docs/ESTILOS.md)                                           | Referências visuais e padrões de componentes.                  |
| [Contratos REST](docs/api/README.md)                                 | Endpoints, modelos e erros da API simulada.                    |
| [Mocks](docs/MOCKS.md)                                               | Cenários, persistência, reset, tempo real e testes.            |
| [Referências do Figma](docs/figma/README.md)                         | Assets e documentação da extração.                             |
| [Enunciado original](docs/DESAFIO.md)                                | Requisitos, critérios e entregas do desafio.                   |
| [Instruções para agentes](AGENTS.md)                                 | Regras e referências para o trabalho assistido por IA.         |
| [Plano de execução](PLANO.md) e [tarefas](docs/tarefas/00-INDICE.md) | Planejamento e critérios de verificação por etapa.             |

## Uso de IA e automações de apoio

A IA foi utilizada principalmente para auxiliar nas decisões arquiteturais, na organização das responsabilidades e no planejamento da implementação.

O fluxo assistido por IA utiliza as instruções de `AGENTS.md`, as skills em `.agents/skills/` e os documentos de planejamento para orientar o trabalho dos agentes. Esses recursos apoiam a execução de tarefas e verificações; não há uma rotina agendada ou pipeline de IA configurado no repositório.

Devido à falta de precisão da IA na reprodução visual, o layout foi revisado e implementado manualmente, com base na referência do Figma.

## Situação da entrega

Devido ao prazo de entrega, o desafio não foi concluído integralmente. Alguns layouts ficaram sem revisão final:

- Menu mobile exibido na home.
- Carrinho mobile.
- Página **Perfil > Carteiras**.

Essas pendências dizem respeito à revisão dos layouts mencionados. Os requisitos originais permanecem disponíveis no enunciado para comparação com a entrega.
