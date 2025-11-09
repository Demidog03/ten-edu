export function decodeJwt<T = any>(token: string | null): (T & { exp?: number }) | null {
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch { return null; }
}

export function isExpired(token: string | null, skewMs = 10_000): boolean {
  const p = decodeJwt(token);
  if (!p?.exp) return !token;
  return Date.now() >= p.exp * 1000 - skewMs;
}
