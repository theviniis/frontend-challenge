import './NFTCard.css';
import { Link } from '@tanstack/react-router';
import type { Nft } from '@/types/api';
import { Price } from './Price';

export function NFTCard({
  nft,
  favorite,
  pending,
  onFavorite,
}: {
  nft: Nft;
  favorite: boolean;
  pending: boolean;
  onFavorite: () => void;
}) {
  return (
    <article className="nft-card group min-w-0">
      <div className="bg-surface-card relative overflow-hidden rounded-lg">
        <Link
          to="/nfts/$nftId"
          params={{ nftId: nft.id }}
          search={{ qty: 1 }}
          aria-label={`Ver ${nft.name}`}
        >
          <img
            src={nft.image}
            alt={`${nft.name}, coleção ${nft.collection}`}
            width={1254}
            height={1254}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </Link>
        <button
          type="button"
          aria-label={`${favorite ? 'Remover' : 'Adicionar'} ${nft.name} ${favorite ? 'dos' : 'aos'} favoritos`}
          aria-pressed={favorite}
          disabled={pending}
          onClick={onFavorite}
          className="bg-ink/80 absolute top-3 right-3 flex size-8 items-center justify-center rounded-md"
        >
          <img
            src="/icons/iconly-bold-star-15-5663.svg"
            alt=""
            className={favorite ? 'opacity-100' : 'opacity-50'}
          />
        </button>
        {nft.rarity === 'RARO' && (
          <span className="bg-amber text-micro text-ink absolute bottom-3 left-3 rounded px-2 py-1 font-bold">
            RARO
          </span>
        )}
      </div>
      <div className="space-y-2 py-3">
        <h3 className="text-body-sm font-medium">
          <Link
            to="/nfts/$nftId"
            params={{ nftId: nft.id }}
            search={{ qty: 1 }}
          >
            {nft.name}
          </Link>
        </h3>
        <p className="text-text-secondary text-tiny">
          {nft.collection} · {nft.edition.current}/{nft.edition.total}
        </p>
        <p className="text-caption font-bold">
          <Price value={nft.price} previousPrice={nft.previousPrice} />
        </p>
      </div>
    </article>
  );
}
