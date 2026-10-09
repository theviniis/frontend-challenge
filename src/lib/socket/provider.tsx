import { useEffect } from 'react';
import { useSession } from '@/lib/session/state';
import { queryClient } from '@/lib/query/client';
import { keyFactory } from '@/lib/query/keys';
import { connectSocket, disconnectSocket, socket } from './client';

export function SocketProvider() {
  const { session } = useSession();
  const token = session?.token;
  const userId = session?.user.id;
  useEffect(() => {
    if (!token || !userId) return;
    const reconcile = () => {
      void queryClient.invalidateQueries({ queryKey: keyFactory.cart(userId) });
      void queryClient.invalidateQueries({
        queryKey: keyFactory.quote(userId).slice(0, 2),
      });
      void queryClient.invalidateQueries({
        queryKey: keyFactory.nfts.all,
        refetchType: 'active',
      });
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'order' &&
          keyFactory.belongsToUser(query.queryKey, userId) &&
          (query.state.data as { status?: string } | undefined)?.status ===
            'pending',
      });
    };
    socket.on('connect', reconcile);
    connectSocket(token);
    return () => {
      socket.off('connect', reconcile);
      disconnectSocket();
    };
  }, [token, userId]);
  return null;
}
