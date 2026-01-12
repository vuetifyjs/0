// Framework
import { createContext } from '@vuetify/v0'

// Utilities
import { inject } from 'vue'

// Types
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
}

export interface BenchmarkConfig {
  label: string
  title: string
  icon: string
  color: string
}

export interface PageMeta {
  // Links
  edit: Readonly<Ref<string>>
  github: Readonly<Ref<string | false>>
  label: Readonly<Ref<string | false>>
  testFileLink: Readonly<Ref<string | null>>
  // Metadata
  level: Readonly<Ref<LevelConfig | null>>
  coverage: Readonly<Ref<CoverageConfig | null>>
  benchmark: Readonly<Ref<BenchmarkConfig | null>>
  renderless: Readonly<Ref<boolean | undefined>>
  lastUpdated: Readonly<Ref<string | null>>
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
