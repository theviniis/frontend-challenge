import { createFileRoute } from '@tanstack/react-router';
import { nftDetailFilterSchema } from '@/features/nft-detail/search-params';
import { RoutePlaceholder } from '@/components/shared/RoutePlaceholder';
export const Route = createFileRoute('/nfts/$nftId')({
  validateSearch: (search) => nftDetailFilterSchema.parse(search),
  component: NftDetailPage,
});
function NftDetailPage() {
  const { nftId } = Route.useParams();
  const { qty } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <RoutePlaceholder
      title="Detalhes do NFT"
      frames="10:244 (desktop) / 15:5536 (mobile)"
      description="Detalhe e quantidade preservada na URL."
    >
      <p>ID do NFT: {nftId}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Diminuir quantidade"
          disabled={qty <= 1}
          onClick={() => navigate({ search: { qty: qty - 1 } })}
        >
          -
        </button>
        <output aria-label="Quantidade">{qty}</output>
        <button
          type="button"
          aria-label="Aumentar quantidade"
          onClick={() => navigate({ search: { qty: qty + 1 } })}
        >
          +
        </button>
      </div>
    </RoutePlaceholder>
  );
}
