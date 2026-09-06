import { useEffect, useState } from 'react';

/**
 * Subscribes a component to one of the lazily-loaded clinical catalogs.
 *
 * Returns an empty array until the chunk has resolved, so callers can render a
 * skeleton or simply show nothing for the (usually sub-second) load. Pass
 * `enabled: false` to defer the download entirely — used by the hero search,
 * which only needs the catalogs once the visitor actually starts searching.
 */
export function useCatalog<T>(
  loader: () => Promise<T[]>,
  enabled: boolean = true
): { items: T[]; loading: boolean } {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoading(true);
    loader()
      .then((data) => {
        if (active) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch(() => {
        // A failed catalog chunk must never blank the page: fall back to an
        // empty list so the surrounding view still renders.
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loader, enabled]);

  return { items, loading };
}
