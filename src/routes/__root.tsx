import {
  Outlet,
  createRootRouteWithContext,
  Link,
} from '@tanstack/react-router';
import type { RouterContext } from '@/lib/session/demo';
import { subscribeSession } from '@/lib/session/storage';
import { useRouter } from '@tanstack/react-router';
import { getStoredSession } from '@/lib/session/guards';
import { useState, useEffect } from 'react';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: RootNotFoundComponent,
  errorComponent: RootErrorComponent,
});

function RootComponent() {
  const [session, setSession] = useState(() => getStoredSession());

  const { demoSession } = Route.useRouteContext();
  const router = useRouter();
  useEffect(
    () =>
      subscribeSession(() => {
        setSession(getStoredSession());
        void router.invalidate();
      }),
    [router]
  );

  return (
    <div className="bg-ink text-foreground min-h-screen font-mono">
      {/* Barra de utilidades / status de sessão para dev e testes */}
      <div className="border-border bg-surface-card text-tiny border-b px-4 py-2">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">GreenMint Router</span>
            <span className="text-text-secondary">|</span>
            <span>
              Sessão:{' '}
              {session ? (
                <span className="text-success font-semibold">
                  Ativa ({session.user.name} - {session.user.email})
                </span>
              ) : (
                <span className="text-coral">Não autenticado</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {demoSession &&
              (session ? (
                <button
                  type="button"
                  onClick={() => demoSession?.logout()}
                  className="border-coral/50 bg-coral/10 text-coral hover:bg-coral/20 cursor-pointer rounded border px-2 py-0.5"
                >
                  Simular Logout
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => demoSession?.login()}
                  className="border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer rounded border px-2 py-0.5"
                >
                  Simular Login Rápido (Ana)
                </button>
              ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl p-6 md:p-12">
        <Outlet />
      </main>
    </div>
  );
}

function RootErrorComponent({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  return (
    <div className="border-coral/40 bg-surface-card text-foreground space-y-4 rounded-md border p-6 font-mono">
      <h2 className="text-h2 text-coral font-bold">Erro ao carregar rota</h2>
      <p className="text-body-sm text-foreground/80">
        {error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="border-border bg-surface-raised text-tiny hover:border-primary rounded border px-4 py-2"
        >
          Tentar novamente
        </button>
        <Link
          to="/"
          search={{ sort: 'relevance', page: 1 }}
          className="border-primary bg-primary/20 text-tiny text-primary hover:bg-primary/30 rounded border px-4 py-2"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}

function RootNotFoundComponent() {
  return (
    <div className="border-border bg-surface-card space-y-4 rounded-md border p-8 text-center font-mono">
      <h1 className="text-display text-coral font-bold">404</h1>
      <p className="text-body text-text-secondary">Página não encontrada</p>
      <div>
        <Link
          to="/"
          search={{ sort: 'relevance', page: 1 }}
          className="border-primary bg-primary/20 text-tiny text-primary hover:bg-primary/30 inline-block rounded border px-4 py-2"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
