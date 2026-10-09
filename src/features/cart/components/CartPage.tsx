import { useQuery } from '@tanstack/react-query';
import { catalogOptions } from '@/features/catalog/queries';
import { NftRecommendationsSection } from '@/components/shared/NftRecommendationsSection';
import { Link } from '@tanstack/react-router';
import { useSession } from '@/lib/session/state';
import { useCart } from '../hooks/useCart';
import { CartItemsTable } from './CartItemsTable';
import { CartSummary } from './CartSummary';
import { CartSkeleton } from './CartSkeleton';

export function CartPage() {
  const { session } = useSession();
  return <CartContents key={session?.token ?? 'anon'} />;
}

function CartContents() {
  const { session } = useSession();
  const recommendations = useQuery(
    catalogOptions({ sort: 'relevance', page: 1 }, session?.user.id)
  );
  const controller = useCart();
  const { cart } = controller;
  if (cart.isPending) return <CartSkeleton />;
  return (
    <main className="flex min-w-0 flex-col">
      <h1 className="text-body hidden font-bold md:block">
        Início / Mercado / Carrinho
      </h1>
      <h1 className="text-body block font-bold md:hidden">Carrinho de NFTs</h1>
      {cart.isError ? (
        <div role="alert" className="flex flex-col items-start">
          <p>Não foi possível carregar o carrinho.</p>
          <button onClick={() => void cart.refetch()}>Tentar novamente</button>
        </div>
      ) : !cart.data.items.length ? (
        <div className="flex flex-col items-start">
          <p>Seu carrinho está vazio.</p>
          <Link to="/" search={{ sort: 'relevance', page: 1 }}>
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 items-start gap-x-21.5 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col lg:col-span-2">
            <CartItemsTable
              items={cart.data.items}
              pending={controller.pending}
              onChange={controller.change}
            />
            <p role="status">{controller.feedback}</p>
          </div>
          <CartSummary controller={controller} />
        </div>
      )}
      <div className="mt-24">
        <NftRecommendationsSection
          title="Colecionadores também viram"
          items={
            recommendations.data?.items.filter(
              (nft) => !cart.data?.items.some((item) => item.nftId === nft.id)
            ) ?? []
          }
          isPending={recommendations.isPending}
          isError={recommendations.isError}
          onRetry={() => void recommendations.refetch()}
          errorMessage="Não foi possível carregar as recomendações"
          emptyMessage="Nenhum NFT recomendado disponível."
        />
      </div>
    </main>
  );
}
