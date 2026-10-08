import { Outlet, createRootRoute, Link } from '@tanstack/react-router';
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router';
import { getStoredSession } from '@/lib/session/guards';
import { useState, useEffect } from 'react';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: RootNotFoundComponent,
  errorComponent: RootErrorComponent,
});

function RootComponent() {
  const [session, setSession] = useState(() => getStoredSession());

  useEffect(() => {
    // Sincroniza estado de sessão ao navegar ou disparar evento no storage
    const sync = () => setSession(getStoredSession());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const handleSimulateLogin = () => {
    const mockSession = {
      token: 'mock.token.' + Date.now(),
      user: {
        id: 'usr_ana',
        name: 'Ana Colecionadora',
        email: 'ana@greenmint.test',
        username: 'ana.eth',
        createdAt: new Date().toISOString(),
      },
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    };
    localStorage.setItem('gm_session', JSON.stringify(mockSession));
    setSession(mockSession);
  };

  const handleSimulateLogout = () => {
    localStorage.removeItem('gm_session');
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-ink text-foreground font-mono">
      {/* Barra de utilidades / status de sessão para dev e testes */}
      <div className="border-b border-border bg-surface-card px-4 py-2 text-tiny">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">GreenMint Router</span>
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
            {session ? (
              <button
                type="button"
                onClick={handleSimulateLogout}
                className="rounded border border-coral/50 bg-coral/10 px-2 py-0.5 text-coral hover:bg-coral/20 cursor-pointer"
              >
                Simular Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSimulateLogin}
                className="rounded border border-primary/50 bg-primary/10 px-2 py-0.5 text-primary hover:bg-primary/20 cursor-pointer"
              >
                Simular Login Rápido (Ana)
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl p-6 md:p-12">
        <NuqsAdapter>
          <Outlet />
        </NuqsAdapter>
      </main>
    </div>
  );
}

function RootErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  return (
    <div className="rounded-md border border-coral/40 bg-surface-card p-6 font-mono text-foreground space-y-4">
      <h2 className="text-h2 font-bold text-coral">Erro ao carregar rota</h2>
      <p className="text-body-sm text-foreground/80">
        {error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded border border-border bg-surface-raised px-4 py-2 text-tiny hover:border-primary"
        >
          Tentar novamente
        </button>
        <Link
          to="/"
          className="rounded border border-primary bg-primary/20 px-4 py-2 text-tiny text-primary hover:bg-primary/30"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}

function RootNotFoundComponent() {
  return (
    <div className="rounded-md border border-border bg-surface-card p-8 text-center font-mono space-y-4">
      <h1 className="text-display font-bold text-coral">404</h1>
      <p className="text-body text-text-secondary">Página não encontrada</p>
      <div>
        <Link
          to="/"
          className="inline-block rounded border border-primary bg-primary/20 px-4 py-2 text-tiny text-primary hover:bg-primary/30"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
