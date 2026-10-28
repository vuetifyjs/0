import { emptyTests } from '@build/feature-tests'
import { describe, expect, it } from 'vitest'

import { coverageDetail, coverageRows } from './coveragePanel'

describe('coverageDetail', () => {
  it('should name the unit run and keep a zero function count', () => {
    expect(coverageDetail({ statements: 92, functions: 0, branches: 71 })).toBe(
      'Unit run. Statements 92% · Functions 0% · Branches 71%',
    )
  })

  it('should omit functions when the report has none', () => {
    expect(coverageDetail({ statements: 100, functions: null, branches: 40 })).toBe(
      'Unit run. Statements 100% · Branches 40%',
    )
  })
})

describe('coverageRows', () => {
  it('should list only kinds that have files, in panel order, linked on master', () => {
    const tests = emptyTests()
    tests.unit = ['adapters/vue-i18n.test.ts', 'index.test.ts']
    tests.ssr = ['index.ssr.test.ts']
    tests.persist = ['index.persist.test.ts']
    tests.benchmarks = ['index.bench.ts']

    const rows = coverageRows(tests, '/composables/useLocale/')

    expect(rows.map(row => row.label)).toEqual(['Unit', 'SSR', 'Persist', 'Benchmarks'])
    expect(rows[0]?.files).toEqual([
      {
        name: 'adapters/vue-i18n.test.ts',
        href: 'https://github.com/vuetifyjs/0/blob/master/packages/0/src/composables/useLocale/adapters/vue-i18n.test.ts',
      },
      {
        name: 'index.test.ts',
        href: 'https://github.com/vuetifyjs/0/blob/master/packages/0/src/composables/useLocale/index.test.ts',
      },
    ])
  })

  it('should return no rows without a feature path', () => {
    const tests = emptyTests()
    tests.browser = ['index.browser.test.ts']
    expect(coverageRows(tests, null)).toEqual([])
    expect(coverageRows(null, '/components/Dialog/')).toEqual([])
  })
})
