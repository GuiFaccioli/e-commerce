type CookieContext = {
  cartItems: Array<{ id: string; variantId: string; quantity: number }>;
  favoriteProductIds: string[];
  recentlyViewedProductIds: string[];
  lastUpdatedAt: string | null;
};

const SESSION_COOKIE = 'mb_session_id';
const CONTEXT_COOKIE = 'mb_ecommerce_context';
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

const emptyContext = (): CookieContext => ({
  cartItems: [],
  favoriteProductIds: [],
  recentlyViewedProductIds: [],
  lastUpdatedAt: null,
});

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce<Record<string, string>>((cookies, pair) => {
    const [rawName, ...rawValue] = pair.trim().split('=');
    if (!rawName) return cookies;
    cookies[rawName] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
}

function encodeContext(context: CookieContext) {
  return JSON.stringify(context);
}

function decodeContext(value?: string): CookieContext {
  if (!value) return emptyContext();

  try {
    return sanitizeContext(JSON.parse(value) as Partial<CookieContext>);
  } catch {
    return emptyContext();
  }
}

function sanitizeIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && /^[A-Z0-9-]+$/i.test(item)).slice(0, 20);
}

function sanitizeContext(value: Partial<CookieContext>): CookieContext {
  const cartItems = Array.isArray(value.cartItems) ? value.cartItems.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const candidate = item as { id?: unknown; variantId?: unknown; quantity?: unknown };
    if (typeof candidate.id !== 'string' || typeof candidate.variantId !== 'string') return [];
    if (!/^[A-Z0-9-]+$/i.test(candidate.id) || !/^[a-z0-9-]+$/i.test(candidate.variantId)) return [];
    const quantity = Number(candidate.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) return [];
    return [{ id: candidate.id, variantId: candidate.variantId, quantity: Math.min(quantity, 99) }];
  }).slice(0, 30) : [];

  return {
    cartItems,
    favoriteProductIds: sanitizeIds(value.favoriteProductIds),
    recentlyViewedProductIds: sanitizeIds(value.recentlyViewedProductIds).slice(0, 8),
    lastUpdatedAt: typeof value.lastUpdatedAt === 'string' ? value.lastUpdatedAt : null,
  };
}

function isSecureRequest(request: Request) {
  const url = new URL(request.url);
  return url.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
}

function cookieHeader(name: string, value: string, secure: boolean) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ONE_WEEK_SECONDS}${secure ? '; Secure' : ''}`;
}

function jsonResponse(request: Request, sessionId: string, context: CookieContext) {
  const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
  const secure = isSecureRequest(request);

  headers.append('Set-Cookie', cookieHeader(SESSION_COOKIE, sessionId, secure));
  headers.append('Set-Cookie', cookieHeader(CONTEXT_COOKIE, encodeContext(context), secure));

  return new Response(JSON.stringify({ sessionId, ...context }), { status: 200, headers });
}

export async function GET(request: Request) {
  const cookies = parseCookies(request.headers.get('cookie') ?? '');
  const sessionId = cookies[SESSION_COOKIE] || crypto.randomUUID();
  const context = decodeContext(cookies[CONTEXT_COOKIE]);

  return jsonResponse(request, sessionId, context);
}

export async function POST(request: Request) {
  try {
    const cookies = parseCookies(request.headers.get('cookie') ?? '');
    const sessionId = cookies[SESSION_COOKIE] || crypto.randomUUID();
    const payload = await request.json() as Partial<CookieContext>;
    const context = sanitizeContext({ ...payload, lastUpdatedAt: new Date().toISOString() });

    return jsonResponse(request, sessionId, context);
  } catch (error) {
    console.error('Failed to save server cookie context', error);
    return Response.json({ error: 'Invalid cookie context payload' }, { status: 400 });
  }
}
