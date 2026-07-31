// Types
import type { Tier } from './useBenchmarkData'

interface RawBenchEntry {
  name?: string
  hz?: number
  mean?: number
  tier?: Tier
}

export interface RawFeature {
  benchmarks?: {
    _groups?: Record<string, Record<string, RawBenchEntry>>
  }
}

interface MetricsSnapshot {
  version: string
  items?: Record<string, RawFeature>
}

// Per-version snapshot loaders, discovered from the directory. Isolated in this
// module so tests can mock the source set — `import.meta.glob` enumerates the
// filesystem at build time, so it cannot be fed fixtures for files that don't
// exist on disk. Mock this module instead.
export const historySources = import.meta.glob<{ default: MetricsSnapshot }>('@/data/metrics/*.json')
