import { createFileRoute, useRouter } from '@tanstack/react-router';
import { parseLoginSearch } from '@/features/auth/search-params';
import { sanitizeRedirect } from '@/lib/session/guards';
import { RoutePlaceholder } from '@/components/shared/RoutePlaceholder';
export const Route = createFileRoute('/login')({
  validateSearch: parseLoginSearch,
  component: LoginPage,
});
function LoginPage() {
  const search = Route.useSearch();
  const { demoSession } = Route.useRouteContext();
  const router = useRouter();
  const safeRedirect = sanitizeRedirect(search.redirect);
  async function login() {
    await demoSession?.login();
    await router.invalidate();
    await router.navigate({ href: safeRedirect });
  }
  return (
    <RoutePlaceholder
      title="Login"
      frames="9:115 (desktop) / 16:1022 (mobile)"
      description="Placeholder de autenticação com retorno seguro ao fluxo."
    >
      <p>
        Destino após login: <span>{safeRedirect}</span>
      </p>
      {search.redirect && search.redirect !== safeRedirect && (
        <p role="status">Redirecionamento inválido descartado.</p>
      )}
      {demoSession ? (
        <button type="button" onClick={() => void login()}>
          Simular login e continuar
        </button>
      ) : (
        <p>Autenticação será implementada na etapa de conta.</p>
      )}
    </RoutePlaceholder>
  );
}
