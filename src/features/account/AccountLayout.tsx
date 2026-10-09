import type { ReactNode } from 'react';
import { ActiveLink } from '@/components/ui/active-link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useSession } from '@/lib/session/state';
import { toast } from 'sonner';

export function AccountLayout({ children }: { children: ReactNode }) {
  const { logout } = useSession();
  return (
    <div className="grid min-w-0 items-start lg:grid-cols-4">
      <aside className="min-w-0">
        <h2>Meu perfil</h2>
        <nav
          aria-label="Minha conta"
          className="grid grid-cols-2 items-start lg:flex lg:flex-col"
        >
          <ActiveLink to="/profile">Dados do perfil</ActiveLink>
          <ActiveLink to="/wallets">Carteiras</ActiveLink>
          {[
            'Atividade',
            'Lista de interesse',
            'Ofertas',
            'Arquivos baixados',
            'Suporte',
          ].map((label) => (
            <span key={label} aria-disabled="true" className="col-span-2">
              {label} (indisponível)
            </span>
          ))}
          <Button
            onClick={() =>
              void logout()
                .then(() => toast.success('Sessão encerrada.'))
                .catch(() => toast.error('Sessão encerrada neste dispositivo.'))
            }
          >
            Sair
          </Button>
        </nav>
      </aside>
      <section className="min-w-0 lg:col-span-3">{children}</section>
    </div>
  );
}

export function AccountSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando conta"
      className="grid min-w-0 md:grid-cols-2"
    >
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i}>
          <span aria-hidden="true">Carregando campo…</span>
          <Input disabled aria-hidden="true" tabIndex={-1} />
        </Skeleton>
      ))}
    </div>
  );
}
