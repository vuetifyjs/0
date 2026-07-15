import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import { hydrate } from '#v0/test-utils/hydrate'

import { Tabs } from './index'

// Types
import type { Component } from 'vue'

const TabsFixture = () =>
  h(Tabs.Root as unknown as Component, { modelValue: 'profile' }, () => [
    h(Tabs.List as unknown as Component, { label: 'Account settings' }, () => [
      h(Tabs.Item as unknown as Component, { value: 'profile' }, () => 'Profile'),
      h(Tabs.Item as unknown as Component, { value: 'password' }, () => 'Password'),
    ]),
    h(Tabs.Panel as unknown as Component, { value: 'profile' }, () => 'Profile content'),
    h(Tabs.Panel as unknown as Component, { value: 'password' }, () => 'Password content'),
  ])

describe('Tabs SSR hydration', () => {
  it('hydrates with stable useId-derived ARIA IDs and zero mismatch warnings', async () => {
    const { html, mismatches } = await hydrate(TabsFixture)

    expect(html).toContain('Profile')
    expect(html).toContain('Password')
    // Verify ARIA wiring rendered server-side
    expect(html).toMatch(/aria-controls="[^"]+panel[^"]*"/)
    expect(html).toMatch(/aria-selected="true"/)
    expect(mismatches).toEqual([])
  })

  it('renders the correct initial selection state', async () => {
    const { html } = await hydrate(TabsFixture)

    expect(html).toContain('Profile content')
  })
})
