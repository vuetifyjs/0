import { describe, expect, it } from 'vitest'

import { hydrate } from '#v0/test-utils/hydrate'

import { Atom } from './index'

// Utilities
import { h } from 'vue'

// Types
import type { Component } from 'vue'

describe('atom SSR hydration', () => {
  it('hydrates a stable Atom with zero mismatch warnings', async () => {
    const { html, mismatches } = await hydrate(
      () => h(Atom as unknown as Component, { as: 'span' }, () => 'Hydrated'),
    )

    expect(html).toContain('Hydrated')
    expect(mismatches).toEqual([])
  })

  it('control: detects a deliberate server/client mismatch', async () => {
    let n = 0
    const { mismatches } = await hydrate(() => h('span', String(n++)))

    expect(mismatches.length).toBeGreaterThan(0)
    expect(mismatches.some(m => /hydration.*mismatch/i.test(m))).toBe(true)
  })
})
