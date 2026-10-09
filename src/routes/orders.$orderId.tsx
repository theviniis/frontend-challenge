import { createFileRoute } from '@tanstack/react-router';
import { requireSession } from '@/lib/session/guards';
import { RoutePlaceholder } from '@/components/shared/RoutePlaceholder';

export const Route = createFileRoute('/orders/$orderId')({
  beforeLoad: ({ location, context }) => requireSession({ location, context }),
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { orderId } = Route.useParams();

  return (
    <RoutePlaceholder
      title="Confirmação"
      frames="11:4385 (desktop)"
      access="privada"
      description="Estado do pedido e recibo (snapshot final da transação)."
    >
      <div className="font-mono">
        <span className="text-tiny text-text-secondary">ID do Pedido:</span>
        <p className="text-body text-primary font-bold">{orderId}</p>
      </div>
    </RoutePlaceholder>
  );
}
