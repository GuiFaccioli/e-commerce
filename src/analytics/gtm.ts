import { ensureDataLayer } from '../lib/dataLayer';

declare global {
  interface Window {
    google_tag_manager?: Record<string, unknown>;
  }
}

let gtmInitialized = false;

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getGtmId() {
  return import.meta.env.VITE_GTM_ID?.trim();
}

export function initializeGtm() {
  if (!isBrowser() || gtmInitialized) return;

  const gtmId = getGtmId();
  if (!gtmId) return;

  const existingScript = document.querySelector<HTMLScriptElement>(`script[data-techzone-gtm-id="${gtmId}"]`);
  if (existingScript) {
    gtmInitialized = true;
    return;
  }

  ensureDataLayer();
  window.dataLayer?.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.dataset.techzoneGtmId = gtmId;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(script);

  gtmInitialized = true;
}

export function getConfiguredGtmIdForDebug() {
  return getGtmId() || null;
}
