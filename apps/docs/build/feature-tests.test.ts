import { describe, expect, it } from 'vitest'

import { classifyTestFile, collectTests } from './feature-tests'
import { scanFeatureTests } from './generate-feature-tests'

describe('classifyTestFile', () => {
  it('should map each colocated suffix onto one kind', () => {
    expect(classifyTestFile('index.test.ts')).toBe('unit')
    expect(classifyTestFile('adapters/vue-i18n.test.ts')).toBe('unit')
    expect(classifyTestFile('adapters/v0.calendar.test.ts')).toBe('unit')
    expect(classifyTestFile('index.browser.test.ts')).toBe('browser')
    expect(classifyTestFile('handle.browser.test.ts')).toBe('browser')
    expect(classifyTestFile('index.ssr.test.ts')).toBe('ssr')
    expect(classifyTestFile('adapters/plain.ssr.test.ts')).toBe('ssr')
    expect(classifyTestFile('index.hydration.test.ts')).toBe('hydration')
    expect(classifyTestFile('index.persist.test.ts')).toBe('persist')
    expect(classifyTestFile('index.bench.ts')).toBe('benchmarks')
  })

  it('should drop package-wide meta tests and source files', () => {
    expect(classifyTestFile('plugins.meta.test.ts')).toBeNull()
    expect(classifyTestFile('index.meta.test.ts')).toBeNull()
    expect(classifyTestFile('index.ts')).toBeNull()
    expect(classifyTestFile('DialogRoot.vue')).toBeNull()
  })
})

describe('collectTests', () => {
  it('should sort paths within a kind and skip non-tests', () => {
    expect(collectTests([
      'index.test.ts',
      'adapters/vue-i18n.test.ts',
      'readme.md',
      'plugins.meta.test.ts',
      'index.bench.ts',
    ])).toEqual({
      unit: ['adapters/vue-i18n.test.ts', 'index.test.ts'],
      browser: [],
      ssr: [],
      hydration: [],
      persist: [],
      benchmarks: ['index.bench.ts'],
    })
  })
})

describe('scanFeatureTests', () => {
  it('should read the files that actually sit in a feature directory', async () => {
    const tests = await scanFeatureTests()

    expect(tests['/components/Dialog/']?.browser).toContain('index.browser.test.ts')
    expect(tests['/components/Dialog/']?.hydration).toContain('index.hydration.test.ts')
    expect(tests['/components/Dialog/']?.unit).toEqual([])

    expect(tests['/composables/useLocale/']?.unit).toContain('adapters/vue-i18n.test.ts')
    expect(tests['/composables/useLocale/']?.unit).toContain('index.test.ts')
    expect(tests['/composables/useLocale/']?.ssr).toContain('index.ssr.test.ts')
    expect(tests['/composables/useLocale/']?.persist).toContain('index.persist.test.ts')

    expect(tests['/composables/createRegistry/']?.benchmarks).toContain('index.bench.ts')
    expect(tests['/composables/useDate/']?.ssr).toContain('index.ssr.test.ts')
    expect(tests['/composables/useDate/']?.hydration).toContain('index.hydration.test.ts')
    expect(tests['/composables/useDate/']?.benchmarks).toContain('index.bench.ts')
    expect(tests['/composables/useDate/']?.unit).toContain('index.test.ts')

    const files = Object.values(tests).flatMap(group => Object.values(group).flat())
    expect(files.some(file => file.endsWith('.meta.test.ts'))).toBe(false)
  })
})
