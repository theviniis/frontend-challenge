import { createFileRoute } from '@tanstack/react-router';
import { requireSession } from '@/lib/session/guards';
import { RoutePlaceholder } from '@/components/shared/RoutePlaceholder';

export const Route = createFileRoute('/checkout')({
  beforeLoad: ({ location, context }) => requireSession({ location, context }),
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <RoutePlaceholder
      title="Pagamento"
      frames="11:2862 (desktop) / 16:748 (mobile)"
      access="privada"
      description="Formulário de checkout, seleção de carteira e rede, revisão e envio do pedido."
    />
  );
}
