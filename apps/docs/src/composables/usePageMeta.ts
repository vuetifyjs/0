// Framework
import { createContext } from '@vuetify/v0'

// Utilities
import { inject } from 'vue'

// Types
import type { ComputedRef } from 'vue'

export interface LevelConfig {
  icon: string
  color: string
  label: string
}

export interface CoverageConfig {
  value: number
  label: string
  color: string
}

export interface BenchmarkConfig {
  label: string
  title: string
  icon: string
  color: string
}

export interface PageMeta {
  // Links
  edit: ComputedRef<string>
  github: ComputedRef<string | false>
  label: ComputedRef<string | false>
  testFileLink: ComputedRef<string | null>
  // Metadata
  level: ComputedRef<LevelConfig | null>
  coverage: ComputedRef<CoverageConfig | null>
  benchmark: ComputedRef<BenchmarkConfig | null>
  renderless: ComputedRef<boolean | undefined>
  lastUpdated: ComputedRef<string | null>
}

export const PAGE_META_KEY = 'v0:docs:page-meta'

export const [usePageMeta, providePageMeta] = createContext<PageMeta>(PAGE_META_KEY)

/**
 * Tries to inject page meta context, returns null if not found.
 * Use this in hybrid components that accept both props and context.
 */
export function usePageMetaOptional (): PageMeta | null {
  return inject<PageMeta>(PAGE_META_KEY, null)
}
