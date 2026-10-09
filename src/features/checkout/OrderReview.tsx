import { Link } from '@tanstack/react-router';
import { CartItem } from '@/features/cart/components/CartItem';
import { displayEth } from '@/lib/money';
import type { Cart } from '@/types/api';

export function OrderReview({
  cart,
  coupon,
  totals,
}: {
  cart: Cart;
  coupon?: string;
  totals?: {
    subtotal: string;
    discount: string;
    networkFee: string;
    total: string;
  };
}) {
  return (
    <section aria-label="Revisão do pedido" className="grid min-w-0">
      <h2>Seus NFTs</h2>
      <div className="flex justify-between">
        <span>NFTs</span>
        <span>Subtotal</span>
      </div>
      <ul>
        {cart.items.map((item) => (
          <li
            key={item.nftId}
            className="grid min-w-0 grid-cols-2 items-center sm:grid-cols-[minmax(0,1fr)_auto_auto]"
          >
            <div className="col-span-2 min-w-0 sm:col-span-1">
              <CartItem item={item} />
            </div>
            <span>(x {item.qty})</span>
            <span className="justify-self-end">
              {displayEth(item.lineTotal)}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-center">
        {coupon ? (
          `Código promocional: ${coupon}`
        ) : (
          <Link to="/cart">Tem um código promocional? Aplique aqui</Link>
        )}
      </p>
      {totals && (
        <dl className="grid grid-cols-2">
          <dt>Subtotal</dt>
          <dd className="justify-self-end">{displayEth(totals.subtotal)}</dd>
          <dt>Desconto do lançamento</dt>
          <dd className="justify-self-end">
            (-) {displayEth(totals.discount)}
          </dd>
          <dt>Taxa de rede</dt>
          <dd className="justify-self-end">{displayEth(totals.networkFee)}</dd>
          <dt className="col-span-2 text-center">Taxa estimada</dt>
          <dd className="hidden">Taxa de rede sujeita à confirmação</dd>
          <dt>Total</dt>
          <dd className="justify-self-end">
            {displayEth(totals.total, { maxDecimals: 4 })}
          </dd>
        </dl>
      )}
    </section>
  );
}
