export type ServerCartItem = {
  id: string;
  variantId: string;
  quantity: number;
};

export type ServerCookieContext = {
  sessionId: string;
  cartItems: ServerCartItem[];
  favoriteProductIds: string[];
  recentlyViewedProductIds: string[];
  lastUpdatedAt: string | null;
};

export type ServerCookieContextInput = Omit<ServerCookieContext, 'sessionId'>;

const CONTEXT_ENDPOINT = '/api/server-cookies/context';

export async function getServerCookieContext(): Promise<ServerCookieContext | null> {
  try {
    const response = await fetch(CONTEXT_ENDPOINT, { credentials: 'same-origin' });
    if (!response.ok) return null;
    return await response.json() as ServerCookieContext;
  } catch {
    return null;
  }
}

export async function saveServerCookieContext(context: ServerCookieContextInput): Promise<ServerCookieContext | null> {
  try {
    const response = await fetch(CONTEXT_ENDPOINT, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    });
    if (!response.ok) return null;
    return await response.json() as ServerCookieContext;
  } catch {
    return null;
  }
}
