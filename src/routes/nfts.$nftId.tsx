import { createFileRoute } from '@tanstack/react-router';
import { useQueryState } from 'nuqs';
import { nftDetailFilterParser } from '@/features/nft-detail/search-params';
import { RoutePlaceholder } from '@/components/shared/RoutePlaceholder';

export const Route = createFileRoute('/nfts/$nftId')({
  component: NftDetailPage,
});

function NftDetailPage() {
  const { nftId } = Route.useParams();
  const [filter, setFilter] = useQueryState('state', nftDetailFilterParser);

  const currentQty = filter.qty ?? 1;

  const handleUpdateQty = (delta: number) => {
    const next = Math.max(1, currentQty + delta);
    setFilter({ qty: next });
  };

  return (
    <RoutePlaceholder
      title="Detalhes do NFT"
      frames="10:244 (desktop) / 15:5536 (mobile)"
      access="pública"
      description="Galeria, edição, quantidade selecionada, favoritos e ação de comprar (nuqs + zod)."
    >
      <div className="space-y-4 font-mono">
        <div>
          <span className="text-tiny text-text-secondary">ID do NFT (param da rota):</span>
          <p className="text-body font-bold text-primary">{nftId}</p>
        </div>

        <div>
          <span className="text-tiny text-text-secondary">Quantidade gerenciada via nuqs + Zod:</span>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleUpdateQty(-1)}
              disabled={currentQty <= 1}
              className="rounded border border-border bg-surface-dark px-3 py-1 text-body-sm hover:border-primary disabled:opacity-40 cursor-pointer"
            >
              -
            </button>
            <span className="text-h2 font-bold text-foreground">{currentQty}</span>
            <button
              type="button"
              onClick={() => handleUpdateQty(1)}
              className="rounded border border-border bg-surface-dark px-3 py-1 text-body-sm hover:border-primary cursor-pointer"
            >
              +
            </button>
          </div>
          <p className="mt-1 text-tiny text-text-secondary">
            Estado sincronizado na URL de forma reativa com validação Zod.
          </p>
        </div>
      </div>
    </RoutePlaceholder>
  );
}
