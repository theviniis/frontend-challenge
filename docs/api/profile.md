# Contrato — Perfil do Colecionador

Todos os endpoints são 🔒 (exigem sessão) e respondem apenas dados do usuário autenticado.

## Modelo

```ts
type Profile = {
  id: string;
  name: string;
  email: string;           // exibido; troca de e-mail fora do escopo
  username?: string;       // "ana.eth" — único entre usuários
  bio?: string;            // máx. 280 caracteres
  avatarUrl?: string;      // "/assets/avatars/…" ou data URL (PNG/JPEG ≤ 512 KB)
  createdAt: string;
  walletCount: number;     // derivado — usado no resumo do perfil
};
```

## Endpoints

### `GET /api/profile` 🔒

```jsonc
// 200 OK → Profile
```

### `PATCH /api/profile` 🔒 — editar dados/avatar

```jsonc
// request (parcial)
{ "name": "Ana C.", "username": "ana.eth", "bio": "Colecionadora…", "avatarUrl": "data:image/png;base64,…" }
// 200 OK → Profile
```

| Campo | Regras |
| --- | --- |
| `name` | 2–60 caracteres |
| `username` | 3–30, `[a-z0-9._]`, único (case-insensitive) |
| `bio` | ≤ 280 caracteres |
| `avatarUrl` | data URL com MIME `image/png` ou `image/jpeg`, ≤ 512 KB (validado no mock) |

Erros:

| Status | `code` | Quando / UI |
| ---: | --- | --- |
| 422 | `VALIDATION_ERROR` | regras acima, com `fields` por campo |
| 409 | `CONFLICT` | `username` já em uso (`fields.username`) |
| 401 | `SESSION_EXPIRED` | sessão caiu no meio da edição → redirecionar preservando retorno |

Alterações confirmadas devem **persistir após refresh** (persistência no `gm_db_v1`).

### `POST /api/profile/password` 🔒 — alterar senha

```jsonc
// request
{ "currentPassword": "Ana12345", "newPassword": "NovaSenha123" }
// 204 No Content
```

| Status | `code` | Quando |
| ---: | --- | --- |
| 422 | `VALIDATION_ERROR` | `currentPassword` incorreta (`fields.currentPassword`) ou nova senha fora das regras (mín. 8, letra+número, ≠ da atual) |
| 401 | `SESSION_EXPIRED` | sessão expirada |

Após sucesso a sessão **permanece ativa** (token não é revogado nesta versão —
decisão registrada em `ARCHITECTURE.md`).

## Formulários de cliente

- Validação local (zod) **e** remota: erros da API sempre vencem os locais.
- Erros por campo associados via `FormField` (`aria-describedby` + `aria-invalid`).
- Avatar: `<input type="file" accept="image/png,image/jpeg">` + preview; exceder 512 KB
  → erro local antes do upload.
