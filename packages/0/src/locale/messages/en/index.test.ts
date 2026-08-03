import { globSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import en from './index'

// Utilities
import { isObject, isString } from '#v0/utilities'

// Protects the scanner from regex rot: if a refactor changes the call shape
// (e.g. `locale.ti(` is renamed) the regex would silently match nothing and
// the coverage test below would pass vacuously. 28 is the number of distinct
// static keys in use when this test was written — it only grows.
const FLOOR = 28

// import.meta.dirname over new URL(): happy-dom replaces the global URL, which
// rejects file-scheme resolution under the v0:unit environment.
const src = join(import.meta.dirname, '../../..')

function strip (source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '')
}

function scan (): Map<string, string> {
  const usage = new Map<string, string>()
  const files = globSync(['components/**/*.vue', 'composables/**/*.ts'], { cwd: src })

  for (const file of files) {
    if (file.endsWith('.test.ts') || file.endsWith('.bench.ts')) continue

    const source = strip(readFileSync(`${src}/${file}`, 'utf8'))

    for (const match of source.matchAll(/locale\.ti?\(\s*'([^']+)'/g)) {
      if (!usage.has(match[1]!)) usage.set(match[1]!, file)
    }
  }

  return usage
}

function resolve (target: unknown, key: string): unknown {
  let node = target

  for (const part of key.split('.')) {
    if (!isObject(node)) return undefined
    node = (node as Record<string, unknown>)[part]
  }

  return node
}

describe('locale/messages/en', () => {
  it('should ship every locale key statically referenced by components and composables', () => {
    const usage = scan()

    for (const [key, file] of usage) {
      const message = resolve(en, key)

      expect(isString(message), `Locale key '${key}' (used by ${file}) is missing from the en catalog — add it to packages/0/src/locale/messages/en/index.ts`).toBe(true)
    }
  })

  it('should extract at least the known number of distinct locale keys', () => {
    expect(scan().size).toBeGreaterThanOrEqual(FLOOR)
  })

  it('should export an English aria-string catalog for every v0 component namespace', () => {
    expect(en).toBeTypeOf('object')

    for (const key of ['AlertDialog', 'Avatar', 'Breadcrumbs', 'Button', 'Carousel', 'Combobox', 'Dialog', 'NumberField', 'Pagination', 'Rating', 'Snackbar', 'Splitter']) {
      expect(en).toHaveProperty(key)
    }
  })

  it('should expose interpolation placeholders on parameterized keys', () => {
    expect(en.Avatar.indicatorLabel).toContain('{count}')
    expect(en.Pagination.status).toContain('{page}')
    expect(en.Pagination.status).toContain('{pages}')
    expect(en.Rating.valueText).toContain('{value}')
    expect(en.Carousel.slide).toContain('{current}')
  })

  it('should provide plain string labels for static keys', () => {
    expect(en.Dialog.close).toBeTypeOf('string')
    expect(en.Pagination.next).toBeTypeOf('string')
    expect(en.Snackbar.close).toBeTypeOf('string')
  })
})
