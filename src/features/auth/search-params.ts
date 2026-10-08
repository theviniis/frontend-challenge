export interface LoginSearchParams {
  redirect?: string;
}

export function parseLoginSearch(raw: Record<string, unknown>): LoginSearchParams {
  const result: LoginSearchParams = {};

  if (typeof raw.redirect === 'string' && raw.redirect.trim()) {
    result.redirect = raw.redirect.trim();
  }

  return result;
}
