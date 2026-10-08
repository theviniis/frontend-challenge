import { redirect, type ParsedLocation } from '@tanstack/react-router';
import { getStoredSession } from './storage';
export { getStoredSession } from './storage';
export type { Session, UserPublic } from '@/types/api';
import type { Session } from '@/types/api';

/**
 * Guarda auxiliar para rotas privadas executado no beforeLoad do TanStack Router.
 * Se o usuário não possuir sessão válida, redireciona para /login preservando a rota atual via ?redirect=.
 */
export function requireSession({
  location,
}: {
  location: ParsedLocation;
}): Session {
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
