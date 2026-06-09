import { useEffect, useMemo, useState } from 'react';
import { clearTrackingHistory, readTrackingHistory, type TrackingHistoryEntry } from '../lib/dataLayer';

function shouldShowPanel() {
  if (typeof window === 'undefined') return false;
  return import.meta.env.DEV || new URLSearchParams(window.location.search).get('debug_tracking') === 'true';
}

function summarize(payload: Record<string, unknown>) {
  const ecommerce = payload.ecommerce as { value?: number; items?: unknown[]; transaction_id?: string } | undefined;
  return {
    value: ecommerce?.value,
    transaction_id: ecommerce?.transaction_id,
    items: ecommerce?.items?.length,
    search_term: payload.search_term,
    filter_category: payload.filter_category,
    filter_term: payload.filter_term,
    results_count: payload.results_count,
  };
}

export function TrackingDebugPanel() {
  const [visible] = useState(shouldShowPanel);
  const [events, setEvents] = useState<TrackingHistoryEntry[]>(() => readTrackingHistory());
  const formatter = useMemo(() => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), []);

  useEffect(() => {
    if (!visible || typeof window === 'undefined') return undefined;

    const onEvent = (event: Event) => {
      const detail = (event as CustomEvent<TrackingHistoryEntry>).detail;
      setEvents((current) => [detail, ...current].slice(0, 30));
    };
    const onClear = () => setEvents([]);

    window.addEventListener('techzone:tracking-event', onEvent);
    window.addEventListener('techzone:tracking-clear', onClear);

    return () => {
      window.removeEventListener('techzone:tracking-event', onEvent);
      window.removeEventListener('techzone:tracking-clear', onClear);
    };
  }, [visible]);

  if (!visible) return null;

  return <aside className="tracking-debug" aria-label="Painel de debug de tracking">
    <div className="tracking-debug__head">
      <strong>Tracking debug</strong>
      <button onClick={clearTrackingHistory}>Limpar</button>
    </div>
    {!events.length ? <p>Nenhum evento enviado ainda.</p> : <ol>
      {events.map((entry) => <li key={entry.id}>
        <div><b>{entry.event}</b><time>{formatter.format(new Date(entry.timestamp))}</time></div>
        <pre>{JSON.stringify(summarize(entry.payload), null, 2)}</pre>
      </li>)}
    </ol>}
  </aside>;
}
