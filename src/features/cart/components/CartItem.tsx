import { Link } from '@tanstack/react-router';
import type { CartItem as Item } from '@/types/api';

export function CartItem({ item }: { item: Item }) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={item.image}
        alt={`NFT ${item.name}`}
        width={70}
        height={70}
        className="rounded-default"
      />
      <div className="flex flex-col items-start gap-1.5">
        <Link
          to="/nfts/$nftId"
          params={{ nftId: item.nftId }}
          search={{ qty: 1 }}
          className="text-body-lg-bold"
        >
          {item.name}
        </Link>
        <p className="text-body-sm text-secondary">
          ID do token: {item.tokenId ? `#${item.tokenId}` : item.nftId}
        </p>
      </div>
    </div>
  );
}
