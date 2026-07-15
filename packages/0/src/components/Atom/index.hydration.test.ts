import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import { hydrate } from '#v0/test-utils/hydrate'

import { Atom } from './index'

// Types
import type { Component } from 'vue'

describe('Atom SSR hydration', () => {
  it('hydrates a stable Atom with zero mismatch warnings', async () => {
    const { html, mismatches } = await hydrate(
      () => h(Atom as unknown as Component, { as: 'span' }, () => 'Hydrated'),
    )

    expect(html).toContain('Hydrated')
    expect(mismatches).toEqual([])
  })

  it('CONTROL: detects a deliberate server/client mismatch', async () => {
    let n = 0
    const { mismatches } = await hydrate(() => h('span', String(n++)))

    expect(mismatches.length).toBeGreaterThan(0)
    expect(mismatches.some(m => /hydration.*mismatch/i.test(m))).toBe(true)
  })
})
