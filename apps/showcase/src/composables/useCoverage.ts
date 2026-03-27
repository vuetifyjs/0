// Utilities
import { shallowRef, type Readonly, type Ref } from 'vue'

// Types
import type { CoverageReport } from '../plugins/types'

const coverageMap = shallowRef<Record<string, CoverageReport>>({})

export function registerCoverage (slug: string, coverage: CoverageReport) {
  coverageMap.value = { ...coverageMap.value, [slug]: coverage }
}

export function useCoverage () {
  function get (slug: string): CoverageReport | undefined {
    return coverageMap.value[slug]
  }

  function score (slug: string): number {
    return get(slug)?.score ?? 100
  }

  return {
    coverageMap: coverageMap as Readonly<Ref<Record<string, CoverageReport>>>,
    get,
    score,
    registerCoverage,
  }
}
