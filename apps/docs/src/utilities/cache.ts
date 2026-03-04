export interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE_TTL = import.meta.env.DEV ? 30 * 1000 : 5 * 60 * 1000 // 30s dev, 5min prod

export function isCacheValid<T> (entry: CacheEntry<T> | null): entry is CacheEntry<T> {
  if (!entry) return false
  return Date.now() - entry.timestamp < CACHE_TTL
}
