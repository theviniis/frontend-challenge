# 13 — Telas Perfil + Carteiras (desktop e mobile)

**Onda:** 7 · **Paralela com:** `12-pagamento` · **Depende de:** 09 · **Bloqueia:** 15, 16
**Label sugerido:** `ui` · **Esforço:** M

## Objetivo

Contas do colecionador: edição de dados/avatar/senha e cadastro de carteiras
principal/secundária — incluindo as variantes mobile (sem frame no Figma).

## Subtasks

### 13.1 — Perfil: visualização e edição de dados

- Frame `9:1238`: dados do colecionador + contagem de carteiras; edição com validação
  local + erros da API (`409` username, `422` campos) via `FormField`

### 13.2 — Avatar

- File input (PNG/JPEG ≤ 512KB) com preview e erro local acima do limite;
  persistência após refresh

### 13.3 — Alteração de senha

- Erros por campo (`currentPassword` incorreta, regras da nova senha) ·
  sessão permanece ativa após sucesso

### 13.4 — Carteiras: CRUD

- Frame `9:1670`: listagem principal/secundária; cadastro (endereço `0x`+40hex,
  `409` duplicado/limite de 2); edição (label/note/rede); promover a principal
  inverte a outra

### 13.5 — Variantes mobile

- Perfil, carteiras e confirmação em 414px seguindo o padrão das telas mobile existentes

### 13.6 — Estados e persistência

- Loading (skeleton) / vazio (CTA cadastrar) / erro (retry) · alterações sobrevivem a refresh

## Critérios de aceite (gate)

- [ ] Cenário `validacao-api` exibe erros por campo vindos do mock
- [ ] `pnpm typecheck && pnpm lint` verdes · sem overflow em 390/414px

## Referências

- `docs/api/profile.md`, `docs/api/wallets.md` · frames `9:1238`, `9:1670` · `docs/ESTILOS.md` §6
