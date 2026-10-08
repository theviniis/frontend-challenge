import { parseAsJson, parseAsInteger } from 'nuqs';
import { z } from 'zod';

export const nftDetailFilterSchema = z.object({
  qty: z.number().int().min(1).default(1),
});

export type NftDetailFilterState = z.infer<typeof nftDetailFilterSchema>;

export const nftDetailFilterParser = parseAsJson(nftDetailFilterSchema).withDefault({ qty: 1 });
export const nftQtyParser = parseAsInteger.withDefault(1);
