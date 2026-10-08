import { createFileRoute } from '@tanstack/react-router';
import { requireSession } from '@/lib/session/guards';
import { RoutePlaceholder } from '@/components/shared/RoutePlaceholder';

export const Route = createFileRoute('/wallets')({
  beforeLoad: ({ location }) => requireSession({ location }),
  component: WalletsPage,
});

function WalletsPage() {
  return (
    <RoutePlaceholder
      title="Carteiras"
      frames="9:1670 (desktop)"
      access="privada"
      description="Gerenciamento de carteiras cripto associadas à conta."
    />
  );
}
