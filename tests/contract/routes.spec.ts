import { describe, it, expect } from 'vitest';
import { sanitizeRedirect, getStoredSession } from '@/lib/session/guards';
import { catalogFilterSchema, catalogFilterParser } from '@/features/catalog/search-params';
import { nftDetailFilterSchema, nftDetailFilterParser } from '@/features/nft-detail/search-params';
import { parseLoginSearch } from '@/features/auth/search-params';

describe('Guards e Segurança de Redirecionamento', () => {
  it('permite apenas caminhos internos válidos', () => {
    expect(sanitizeRedirect('/checkout')).toBe('/checkout');
    expect(sanitizeRedirect('/profile?tab=security')).toBe('/profile?tab=security');
    expect(sanitizeRedirect('/orders/ord_123')).toBe('/orders/ord_123');
  });

  it('bloqueia ataques de Open Redirect', () => {
    expect(sanitizeRedirect('//evil.com')).toBe('/');
    expect(sanitizeRedirect('https://evil.com')).toBe('/');
    expect(sanitizeRedirect('http://evil.com/phishing')).toBe('/');
    expect(sanitizeRedirect('javascript:alert(1)')).toBe('/');
    expect(sanitizeRedirect('/\\evil.com')).toBe('/');
    expect(sanitizeRedirect('')).toBe('/');
    expect(sanitizeRedirect(undefined)).toBe('/');
  });

  it('valida formato e expiração de sessão em storage mock', () => {
    expect(getStoredSession()).toBeNull();
  });
});

describe('Catalog Search Params Parsing (nuqs + Zod)', () => {
  it('valida schema Zod do catálogo', () => {
    const parsed = catalogFilterSchema.parse({
      q: 'cyberpunk',
      sort: 'price_asc',
      page: 2,
    });
    expect(parsed).toEqual({
      q: 'cyberpunk',
      sort: 'price_asc',
      page: 2,
    });
  });

  it('faz parse e serialização via nuqs parseAsJson com Zod', () => {
    const rawJson = JSON.stringify({
      q: 'cyberpunk',
      categories: ['Arte digital'],
      sort: 'popular',
      page: 3,
    });
    const parsed = catalogFilterParser.parse(rawJson);
    expect(parsed).not.toBeNull();
    const serialized = catalogFilterParser.serialize(parsed!);
    expect(serialized).toBe(rawJson);
  });

  it('retorna null em caso de JSON malformado ou inválido (valor descartado pela nuqs)', () => {
    expect(catalogFilterParser.parse('invalid-json')).toBeNull();
    expect(catalogFilterParser.parse(JSON.stringify({ sort: 'invalid_sort' }))).toBeNull();
  });
});

describe('NFT Detail & Login Search Params', () => {
  it('valida e faz parse do estado do NFT com nuqs e Zod', () => {
    expect(nftDetailFilterParser.parse(JSON.stringify({ qty: 5 }))).toEqual({ qty: 5 });
    expect(nftDetailFilterSchema.parse({ qty: 10 })).toEqual({ qty: 10 });
  });

  it('parse correto de redirect para login', () => {
    expect(parseLoginSearch({})).toEqual({});
    expect(parseLoginSearch({ redirect: ' /checkout ' })).toEqual({ redirect: '/checkout' });
  });
});
