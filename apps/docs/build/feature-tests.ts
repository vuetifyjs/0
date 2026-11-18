/** Kinds of colocated test file, in the order the coverage panel lists them. */
export const TEST_KINDS = ['unit', 'browser', 'ssr', 'hydration', 'persist', 'benchmarks'] as const

export type TestKind = typeof TEST_KINDS[number]

export interface FeatureTests {
  unit: string[]
  browser: string[]
  ssr: string[]
  hydration: string[]
  persist: string[]
  benchmarks: string[]
}

export function emptyTests (): FeatureTests {
  return {
    unit: [],
    browser: [],
    ssr: [],
    hydration: [],
    persist: [],
    benchmarks: [],
  }
}

/**
 * Which panel row a path belongs on.
 * Package-wide `*.meta.test.ts` locks are not a property of one feature.
 * Anything else ending in `.test.ts` is a unit file, including adapter siblings.
 */
export function classifyTestFile (relativePath: string): TestKind | null {
  const name = relativePath.split('/').pop() ?? relativePath
  if (name.endsWith('.meta.test.ts')) return null
  if (name.endsWith('.bench.ts')) return 'benchmarks'
  if (name.endsWith('.browser.test.ts')) return 'browser'
  if (name.endsWith('.ssr.test.ts')) return 'ssr'
  if (name.endsWith('.hydration.test.ts')) return 'hydration'
  if (name.endsWith('.persist.test.ts')) return 'persist'
  if (name.endsWith('.test.ts')) return 'unit'
  return null
}

/** Group feature-relative paths. Non-tests drop out. Paths within a kind are sorted. */
export function collectTests (relativePaths: readonly string[]): FeatureTests {
  const tests = emptyTests()
  for (const path of relativePaths) {
    const kind = classifyTestFile(path)
    if (!kind) continue
    tests[kind].push(path)
  }
  for (const kind of TEST_KINDS) {
    tests[kind].sort((a, b) => a.localeCompare(b))
  }
  return tests
}

export function hasTests (tests: FeatureTests): boolean {
  for (const kind of TEST_KINDS) {
    if (tests[kind].length > 0) return true
  }
  return false
}
