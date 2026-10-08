import { z } from 'zod';
import { emptyToUndefined } from '@/features/catalog/search-params';
export const loginSearchSchema = z.object({
  redirect: z.preprocess(emptyToUndefined, z.string().trim().optional()),
});
export type LoginSearchParams = z.infer<typeof loginSearchSchema>;
export const parseLoginSearch = (raw: Record<string, unknown>) =>
  loginSearchSchema.parse(raw);
