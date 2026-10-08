import { createFileRoute } from '@tanstack/react-router';
import { requireSession } from '@/lib/session/guards';
import { RoutePlaceholder } from '@/components/shared/RoutePlaceholder';

export const Route = createFileRoute('/profile')({
  beforeLoad: ({ location }) => requireSession({ location }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <RoutePlaceholder
      title="Perfil"
      frames="9:1238 (desktop)"
      access="privada"
      description="Dados cadastrais, avatar e configurações do colecionador."
    />
  );
}
