import { redirect, type ParsedLocation } from '@tanstack/react-router';

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Session {
  token: string;
  user: UserPublic;
  expiresAt: string;
}

const SESSION_STORAGE_KEY = 'gm_session';

/**
 * Lê e valida de forma síncrona a sessão gravada no localStorage.
 * Retorna a sessão se válida e não expirada, ou null caso contrário.
 */
export function getStoredSession(): Session | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed || typeof parsed !== 'object') return null;

    if (!parsed.token || !parsed.user?.id || !parsed.expiresAt) {
      return null;
    }

    const expiresAtMs = new Date(parsed.expiresAt).getTime();
    if (Number.isNaN(expiresAtMs) || expiresAtMs <= Date.now()) {
      return null;
    }

    return parsed as Session;
  } catch {
    return null;
  }
}

/**
 * Guarda auxiliar para rotas privadas executado no beforeLoad do TanStack Router.
 * Se o usuário não possuir sessão válida, redireciona para /login preservando a rota atual via ?redirect=.
 */
export function requireSession({ location }: { location: ParsedLocation }): Session {
  const session = getStoredSession();

  if (!session) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    });
  }

  return session;
}

/**
 * Sanitiza o caminho de redirecionamento para prevenir vulnerabilidades de Open Redirect.
 * Permite apenas caminhos internos que começam com um único '/' (e não '//' ou protocolos).
 */
export function sanitizeRedirect(redirectUrl?: string): string {
  if (!redirectUrl || typeof redirectUrl !== 'string') {
    return '/';
  }

  const trimmed = redirectUrl.trim();

  // Rejeita links externos, URLs com esquema (ex: https:, javascript:) e caminhos de protocolo relativo (//)
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/\\') ||
    trimmed.includes('://')
  ) {
    return '/';
  }

  return trimmed;
}
