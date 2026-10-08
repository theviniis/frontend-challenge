import { z } from 'zod';
import { emptyToUndefined } from '@/features/catalog/search-params';
export const nftDetailFilterSchema = z.object({
  qty: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).default(1)
  ),
});
export type NftDetailFilterState = z.infer<typeof nftDetailFilterSchema>;
