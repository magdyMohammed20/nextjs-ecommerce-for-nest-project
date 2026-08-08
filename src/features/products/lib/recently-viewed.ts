export interface RecentlyViewedItem {
  id: number;
  name: string;
  imageUrl: string | null;
  price: number;
}

const STORAGE_KEY = "recently-viewed";
const MAX_ITEMS = 6;

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentlyViewedItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Records a product visit, newest first, deduped, capped at MAX_ITEMS. */
export function recordRecentlyViewed(item: {
  id: number;
  name: string;
  imageUrl: string | null;
  price: number;
}): RecentlyViewedItem[] {
  if (typeof window === "undefined") return getRecentlyViewed();
  const current = getRecentlyViewed().filter((entry) => entry.id !== item.id);
  const next = [{ ...item }, ...current].slice(0, MAX_ITEMS);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full/unavailable — silently ignore.
  }
  return next;
}
