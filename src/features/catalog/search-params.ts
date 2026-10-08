import { parseAsJson, parseAsString, parseAsInteger } from 'nuqs';
import { z } from 'zod';

export const catalogSortOptions = [
  'relevance',
  'recent',
  'price_asc',
  'price_desc',
  'popular',
] as const;

export type CatalogSort = (typeof catalogSortOptions)[number];

// 1. Zod Schema dos filtros do catálogo
export const catalogFilterSchema = z.object({
  q: z.string().optional(),
  categories: z.array(z.string()).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sort: z.enum(catalogSortOptions).optional(),
  page: z.number().int().min(1).optional(),
});

export type CatalogFilterState = z.infer<typeof catalogFilterSchema>;

// 2. Parser com nuqs + parseAsJson
export const catalogFilterParser = parseAsJson(catalogFilterSchema).withDefault({});

// Parsers granulares para uso alternativo / direto se desejado
export const catalogParamParsers = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
};
