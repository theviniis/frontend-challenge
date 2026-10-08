import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { parseLoginSearch } from '@/features/auth/search-params';
import { sanitizeRedirect } from '@/lib/session/guards';
import { RoutePlaceholder } from '@/components/shared/RoutePlaceholder';

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => parseLoginSearch(search),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const safeRedirect = sanitizeRedirect(search.redirect);

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
    window.dispatchEvent(new Event('storage'));

    // Navega para o redirect sanitizado (apenas rotas internas)
    navigate({ to: safeRedirect });
  };

  return (
    <RoutePlaceholder
      title="Login"
      frames="9:115 (desktop) / 16:1022 (mobile)"
      access="pública"
      description="Autenticação com e-mail e senha. Suporta parâmetro ?redirect= para retorno seguro ao fluxo."
    >
      <div className="space-y-4 font-mono">
        <div>
          <span className="text-tiny text-text-secondary">Parâmetro ?redirect= recebido:</span>
          <p className="text-body-sm font-semibold text-text-accent">
            {search.redirect ? `"${search.redirect}"` : '(nenhum)'}
          </p>
        </div>

        <div>
          <span className="text-tiny text-text-secondary">Destino validado pós-login (anti open-redirect):</span>
          <p className="text-body font-bold text-primary">{safeRedirect}</p>
          {search.redirect && search.redirect !== safeRedirect && (
            <p className="mt-1 text-tiny text-coral">
              Aviso: Redirecionamento externo ou malicioso detectado e descartado para segurança.
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSimulateLogin}
            className="rounded border border-primary bg-primary px-4 py-2 text-tiny font-bold text-ink hover:bg-primary-light cursor-pointer"
          >
            Efetuar Login e Continuar para {safeRedirect}
          </button>
        </div>
      </div>
    </RoutePlaceholder>
  );
}
