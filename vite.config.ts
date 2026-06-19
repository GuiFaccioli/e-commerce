import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
  return Buffer.from(JSON.stringify(context), 'utf8').toString('base64url');
}

function decodeContext(value?: string): CookieContext {
  if (!value) return emptyContext();

  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as Partial<CookieContext>;
    return sanitizeContext(parsed);
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

function readBody(request: NodeJS.ReadableStream) {
  return new Promise<string>((resolve, reject) => {
    let body = '';
    request.on('data', (chunk: Buffer) => {
      body += chunk.toString('utf8');
      if (body.length > 8_192) reject(new Error('Payload too large'));
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function cookieHeader(name: string, value: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ONE_WEEK_SECONDS}${secure}`;
}

function serverCookieStudyPlugin() {
  return {
    name: 'server-cookie-study',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? '', 'http://localhost');
        if (url.pathname !== '/api/server-cookies/context') {
          next();
          return;
        }

        try {
          const cookies = parseCookies(request.headers.cookie);
          const sessionId = cookies[SESSION_COOKIE] || crypto.randomUUID();
          const currentContext = decodeContext(cookies[CONTEXT_COOKIE]);
          const context = request.method === 'POST'
            ? sanitizeContext({ ...JSON.parse(await readBody(request)), lastUpdatedAt: new Date().toISOString() })
            : currentContext;

          response.statusCode = 200;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.setHeader('Set-Cookie', [
            cookieHeader(SESSION_COOKIE, sessionId),
            cookieHeader(CONTEXT_COOKIE, encodeContext(context)),
          ]);
          response.end(JSON.stringify({ sessionId, ...context }));
        } catch {
          response.statusCode = 400;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ error: 'Invalid cookie context payload' }));
        }
      });
    },
  };
}

export default defineConfig({ plugins: [serverCookieStudyPlugin(), react()] });
