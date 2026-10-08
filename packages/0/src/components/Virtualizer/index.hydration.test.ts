import { describe, expect, it } from 'vitest'

import { hydrate } from '#v0/test-utils/hydrate'

import { Virtualizer } from './index'

// Utilities
import { h } from 'vue'

// Types
import type { Component } from 'vue'

const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Row ${i}` }))

function VirtualizerFixture () {
  return h(Virtualizer.Root as unknown as Component, { items, itemHeight: 40, height: 400 }, {
    default: (props: { items: { index: number, raw: { id: number, name: string } }[] }) =>
      props.items.map(item =>
        h(Virtualizer.Item as unknown as Component, { key: item.raw.id, index: item.index }, () => item.raw.name),
      ),
  })
}

describe('virtualizer SSR hydration', () => {
  it('hydrates the empty container and spacers with zero mismatch warnings', async () => {
    const { html, mismatches } = await hydrate(VirtualizerFixture)

    expect(html).toContain('data-spacer="start"')
    expect(html).toContain('data-spacer="end"')
    expect(html).toMatch(/data-spacer="start" style="height:0px;"/)
    expect(html).toMatch(/data-spacer="end" style="height:0px;"/)
    expect(mismatches).toEqual([])
  })

  it('renders no rows on the server', async () => {
    const { html } = await hydrate(VirtualizerFixture)

    expect(html).not.toContain('data-index')
  })
})
