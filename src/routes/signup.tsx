import { createFileRoute } from '@tanstack/react-router';
import { RoutePlaceholder } from '@/components/shared/RoutePlaceholder';

export const Route = createFileRoute('/signup')({
  component: SignupPage,
});

function SignupPage() {
  return (
    <RoutePlaceholder
      title="Cadastro"
      frames="9:1022 (desktop) / 16:1228 (mobile)"
      access="pública"
      description="Criação de nova conta de usuário colecionador."
    />
  );
}
