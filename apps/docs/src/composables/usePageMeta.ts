// Framework
import { createContext } from '@vuetify/v0'

// Utilities
import { inject } from 'vue'

// Types
import type { CoverageRow } from '@/components/docs/meta/coveragePanel'
import type { Level } from '@/constants/maturity'
import type { Ref } from 'vue'

export interface LevelConfig {
  icon: string
  color: string
  label: string
}

export interface CoverageConfig {
  value: number
  label: string
  color: string
  /** Unit-run breakdown. Absent on the static guide illustration. */
  detail?: string
  /** Test files that exist for this feature. Empty kinds are omitted. */
  rows?: CoverageRow[]
}

export interface BenchmarkConfig {
  label: string
  title: string
  icon: string
  color: string
}

export interface PhaseConfig {
  level: Level
  since: string | null
  notes?: string
  icon: string
  color: string
  label: string
  title: string
}

export interface PageMeta {
  // Links
  edit: Readonly<Ref<string>>
  github: Readonly<Ref<string | false>>
  label: Readonly<Ref<string | false>>
  // Metadata
  phase: Readonly<Ref<PhaseConfig | null>>
  level: Readonly<Ref<LevelConfig | null>>
  coverage: Readonly<Ref<CoverageConfig | null>>
  benchmark: Readonly<Ref<BenchmarkConfig | null>>
  renderless: Readonly<Ref<boolean | undefined>>
  lastUpdated: Readonly<Ref<string | null>>
  lastCommit: Readonly<Ref<{ hash: string, url: string } | null>>
}

export const PAGE_META_KEY = 'v0:docs:page-meta'

export const [usePageMeta, providePageMeta] = createContext<PageMeta>(PAGE_META_KEY)

/**
 * Tries to inject page meta context, returns null if not found.
 * Use this in hybrid components that accept both props and context.
 */
export function usePageMetaOptional (): PageMeta | null {
  return inject<PageMeta | null>(PAGE_META_KEY, null)
}
