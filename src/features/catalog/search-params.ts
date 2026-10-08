import { z } from 'zod';
import { ethSchema, nftSortSchema } from '@/lib/http/schemas';
export const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && !value.trim() ? undefined : value;
export const catalogFilterSchema = z.object({
  q: z.preprocess(emptyToUndefined, z.string().optional()),
  categories: z.preprocess((value) => {
    if (value === undefined) return undefined;
    const values = Array.isArray(value) ? value : [value];
    const nonempty = values.filter(
      (item) => emptyToUndefined(item) !== undefined
    );
    return nonempty.length ? nonempty : undefined;
  }, z.array(z.string()).optional()),
  minPrice: z.preprocess(emptyToUndefined, ethSchema.optional()),
  maxPrice: z.preprocess(emptyToUndefined, ethSchema.optional()),
  sort: z.preprocess(emptyToUndefined, nftSortSchema.default('relevance')),
  page: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).default(1)
  ),
});
export type CatalogFilterState = z.infer<typeof catalogFilterSchema>;
export const parseCatalogSearch = (search: Record<string, unknown>) =>
  catalogFilterSchema.parse(search);
