import { useEffect } from 'react';
import { useSession } from '@/lib/session/state';
import { queryClient } from '@/lib/query/client';
import { keyFactory } from '@/lib/query/keys';
import { connectSocket, disconnectSocket, socket } from './client';
import { applyNftEvent } from './nft-cache';
import { toast } from 'sonner';
import { displayEth, cmpEth } from '@/lib/money';
import type { Cart } from '@/types/api';

export function SocketProvider() {
  const { session } = useSession();
  const token = session?.token;
  const userId = session?.user.id;
  useEffect(() => {
    const onNftUpdated = (raw: unknown) => {
      const event = applyNftEvent(queryClient, raw);
      if (!event) return;
      const item = queryClient
        .getQueryData<Cart>(keyFactory.cart(userId))
        ?.items.find((entry) => entry.nftId === event.resourceId);
      if (
        item &&
        cmpEth(event.payload.price, event.payload.previousPrice) !== 0
      )
        toast.info(
          `${item.name}: preço alterado de ${displayEth(event.payload.previousPrice)} para ${displayEth(event.payload.price)}`
        );
    };
    const reconcile = () => {
      void queryClient.invalidateQueries({ queryKey: keyFactory.cart(userId) });
      void queryClient.invalidateQueries({
        queryKey: keyFactory.quote(userId).slice(0, 2),
      });
      void queryClient.invalidateQueries({
        queryKey: keyFactory.nfts.all,
        predicate: (query) => query.queryKey[1] !== 'event',
        refetchType: 'active',
      });
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'order' &&
          !!userId &&
          keyFactory.belongsToUser(query.queryKey, userId) &&
          (query.state.data as { status?: string } | undefined)?.status ===
            'pending',
      });
    };
    socket.on('connect', reconcile);
    socket.on('nft.updated', onNftUpdated);
    connectSocket(token);
    return () => {
      socket.off('connect', reconcile);
      socket.off('nft.updated', onNftUpdated);
      disconnectSocket();
    };
  }, [token, userId]);
  return null;
}
