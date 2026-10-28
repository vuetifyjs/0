// Framework
import { isNullOrUndefined } from '@vuetify/v0'

// Types
import type { FeatureTests, TestKind } from '@build/feature-tests'

export interface CoverageFile {
  name: string
  href: string
}

export interface CoverageRow {
  label: string
  files: CoverageFile[]
}

const BLOB = 'https://github.com/vuetifyjs/0/blob/master/packages/0/src'

const ROWS: { kind: TestKind, label: string }[] = [
  { kind: 'unit', label: 'Unit' },
  { kind: 'browser', label: 'Browser' },
  { kind: 'ssr', label: 'SSR' },
  { kind: 'hydration', label: 'Hydration' },
  { kind: 'persist', label: 'Persist' },
  { kind: 'benchmarks', label: 'Benchmarks' },
]

function testFileHref (github: string, file: string): string {
  const root = github.endsWith('/') ? github.slice(0, -1) : github
  return `${BLOB}${root}/${file}`
}

/** The percent is the unit-project figure. Browser files never enter it. */
export function coverageDetail (coverage: {
  statements: number
  functions?: number | null
  branches: number
}): string {
  const functions = isNullOrUndefined(coverage.functions) ? '' : ` · Functions ${coverage.functions}%`
  return `Unit run. Statements ${coverage.statements}%${functions} · Branches ${coverage.branches}%`
}

/** Rows for kinds that have at least one file, in panel order. */
export function coverageRows (tests: FeatureTests | null, github: string | null): CoverageRow[] {
  if (!tests || !github) return []
  const rows: CoverageRow[] = []
  for (const row of ROWS) {
    const files = tests[row.kind]
    if (files.length === 0) continue
    rows.push({
      label: row.label,
      files: files.map(name => ({ name, href: testFileHref(github, name) })),
    })
  }
  return rows
}
