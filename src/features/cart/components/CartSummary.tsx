import { Link } from '@tanstack/react-router';
import { useSession } from '@/lib/session/state';
import type { CartController } from '../hooks/useCart';
import { errorCode } from '../queries';
import { CouponInput } from './CouponInput';
import { QuoteSummary } from './QuoteSummary';
import { CartSkeleton } from './CartSkeleton';
import { Button } from '@/components/ui/button';

export function CartSummary({ controller }: { controller: CartController }) {
  const { session } = useSession();
  const { cart, quote } = controller;
  return (
    <section aria-label="Resumo da carteira" className="flex min-w-0 flex-col">
      <h2 className="text-body-lg-bold border-primary mb-6 hidden border-b-[0.3px] pb-3 md:inline-block">
        Resumo da carteira
      </h2>
      <CouponInput
        coupon={controller.coupon}
        error={controller.couponError}
        pending={controller.couponPending || controller.pending}
        onApply={controller.applyCoupon}
        onRemove={controller.removeCoupon}
      />
      {quote.isFetching || controller.pending ? (
        <CartSkeleton summary />
      ) : quote.isError ? (
        <div role="alert" className="flex flex-col items-start">
          <p>
            {errorCode(quote.error) === 'INSUFFICIENT_STOCK'
              ? 'Estoque insuficiente. Ajuste ou remova os itens indisponíveis.'
              : 'Não foi possível carregar a cotação.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void cart.refetch();
              void quote.refetch();
            }}
          >
            Revalidar cotação
          </Button>
        </div>
      ) : (
        quote.data && <QuoteSummary quote={quote.data} />
      )}
      {quote.data?.available &&
        !quote.isFetching &&
        !quote.isError &&
        !controller.pending &&
        !controller.couponPending && (
          <Button asChild>
            <Link to="/checkout" search={{ coupon: controller.coupon }}>
              {session ? 'Finalizar compra' : 'Conectar e finalizar'}
            </Link>
          </Button>
        )}
      <Button variant="ghost" className="mt-2">
        <Link to="/" search={{ sort: 'relevance', page: 1 }}>
          Continuar explorando
        </Link>
      </Button>
    </section>
  );
}
