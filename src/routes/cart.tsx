import { createFileRoute } from '@tanstack/react-router';
import { RoutePlaceholder } from '@/components/shared/RoutePlaceholder';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

function CartPage() {
  return (
    <RoutePlaceholder
      title="Carrinho"
      frames="11:1278 (desktop) / 16:360 (mobile)"
      access="pública"
      description="Itens do carrinho, quantidades, cupom de desconto, resumo e cotação em tempo real."
    />
  );
}
