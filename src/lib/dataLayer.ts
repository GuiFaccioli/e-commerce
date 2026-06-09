export type DataLayerEvent = Record<string, unknown> & { event: string };
export type TrackingHistoryEntry = {
  id: string;
  event: string;
  timestamp: string;
  payload: DataLayerEvent;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const HISTORY_KEY = 'techzone_tracking_debug_history';
const MAX_HISTORY_ITEMS = 30;

function isBrowser() {
  return typeof window !== 'undefined';
}

export function ensureDataLayer() {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
}

function persistDebugEvent(eventData: DataLayerEvent) {
  if (!isBrowser()) return;

  const entry: TrackingHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    event: eventData.event,
    timestamp: new Date().toISOString(),
    payload: eventData,
  };

  try {
    const current = readTrackingHistory();
    const next = [entry, ...current].slice(0, MAX_HISTORY_ITEMS);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent<TrackingHistoryEntry>('techzone:tracking-event', { detail: entry }));
  } catch {
    // Debug history must never break the commerce flow.
  }
}

export function pushToDataLayer(eventData: DataLayerEvent) {
  if (!isBrowser()) return;

  ensureDataLayer();
  window.dataLayer?.push(eventData);
  persistDebugEvent(eventData);

  if (import.meta.env.DEV) {
    console.info('[TechZone dataLayer]', eventData.event, eventData);
  }
}

export function readTrackingHistory(): TrackingHistoryEntry[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TrackingHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearTrackingHistory() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new Event('techzone:tracking-clear'));
}

