import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { orderOptions } from './queries';
import { readPending, clearPending } from './pending';
import { clearCheckoutDraft } from '@/lib/session/checkout-draft';
import { keyFactory } from '@/lib/query/keys';
import { ErrorState } from '@/components/shared/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentTotals } from './PaymentTotals';
import { displayEth } from '@/lib/money';
export function OrderPage({
  userId,
  orderId,
}: {
  userId: string;
  orderId: string;
}) {
  const query = useQuery(orderOptions(userId, orderId));
  const client = useQueryClient();
  const order = query.data;
  useEffect(() => {
    if (!order || order.status === 'pending') return;
    if (readPending(userId)?.key === order.idempotencyKey) {
      clearPending();
      if (order.status === 'confirmed') clearCheckoutDraft();
    }
    if (order.status === 'confirmed') {
      void client.invalidateQueries({ queryKey: keyFactory.cart(userId) });
      void client.invalidateQueries({
        queryKey: keyFactory.quote(userId).slice(0, 2),
      });
    }
  }, [order, client, userId]);
  if (query.isPending)
    return (
      <div role="status">
        <Skeleton />
        <span>Carregando pedido</span>
      </div>
    );
  if (query.isError)
    return (
      <ErrorState
        title="Não foi possível consultar o pedido"
        onRetry={() => void query.refetch()}
      />
    );
  if (!order) return null;
  return (
    <section className="grid min-w-0">
      <h1>
        {order.status === 'confirmed'
          ? 'Pagamento confirmado'
          : order.status === 'declined'
            ? 'Pagamento recusado'
            : 'Pedido pendente'}
      </h1>
      <p>ID do Pedido: {order.id}</p>
      {order.status === 'pending' && (
        <p role="status">Aguardando confirmação do pedido.</p>
      )}
      {order.status === 'declined' && <p role="alert">{order.declineReason}</p>}
      {order.status === 'confirmed' && (
        <section aria-label="Recibo">
          <h2>Recibo</h2>
          {order.collector && (
            <dl aria-label="Colecionador do pedido">
              <dt>Nome de exibição</dt>
              <dd>{order.collector.name}</dd>
              <dt>E-mail</dt>
              <dd>{order.collector.email}</dd>
              <dt>Nome de usuário</dt>
              <dd>{order.collector.username}</dd>
              <dt>Nome do perfil</dt>
              <dd>{order.collector.profileName}</dd>
              {order.collector.referralCode && (
                <>
                  <dt>Código de indicação</dt>
                  <dd>{order.collector.referralCode}</dd>
                </>
              )}
            </dl>
          )}
          <ul>
            {order.items.map((item) => (
              <li key={item.nftId}>
                {item.name} — edição {item.edition.current}/{item.edition.total}{' '}
                — {item.qty} unidade(s) — {displayEth(item.unitPrice)} por
                unidade — {displayEth(item.lineTotal)}
              </li>
            ))}
          </ul>
          <PaymentTotals value={order} />
          <p>Cupom: {order.coupon?.code ?? 'Sem cupom'}</p>
          <p>Carteira: {order.wallet.label}</p>
          <p>
            Endereço: <span className="break-all">{order.wallet.address}</span>
          </p>
          {order.wallet.provider && (
            <p>Tipo de carteira: {order.wallet.provider}</p>
          )}
          {order.wallet.ensName && <p>Nome ENS: {order.wallet.ensName}</p>}
          {order.wallet.secondaryIdentity && (
            <p>
              ENS ou carteira secundária:{' '}
              <span className="break-all">
                {order.wallet.secondaryIdentity}
              </span>
            </p>
          )}
          {order.wallet.note && <p>Observação: {order.wallet.note}</p>}
          <p>Rede: {order.network}</p>
          <p>
            Transação: <span className="break-all">{order.txHash}</span>
          </p>
          {order.explorerUrl && (
            <p>
              Explorador externo simulado (link inerte):{' '}
              <span className="break-all">{order.explorerUrl}</span>
            </p>
          )}
        </section>
      )}
      <Link to="/cart">Voltar ao carrinho</Link>
    </section>
  );
}
