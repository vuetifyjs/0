import { describe, expect, it } from 'vitest'

import { hydrate } from '#v0/test-utils/hydrate'

import { TimePicker } from './index'

// Utilities
import { h } from 'vue'

// Types
import type { Component } from 'vue'

// The handler makes the model controlled, as `v-model` does. A server render
// cannot re-render its parent, so the prop keeps the value it was given.
function picker (modelValue: string) {
  const props = { modelValue, 'minuteStep': 15, 'name': 'alarm', 'onUpdate:modelValue': () => {} }

  return h(TimePicker.Root as unknown as Component, props, () => [
    h(TimePicker.Hour as unknown as Component, {}, { default: ({ text }: { text: string }) => text }),
    h(TimePicker.Minute as unknown as Component, {}, { default: ({ text }: { text: string }) => text }),
  ])
}

describe('timePicker SSR hydration', () => {
  it('should render the hidden input from the fields, not the raw model', async () => {
    const { html, mismatches } = await hydrate(() => picker('09:07'))

    expect(html).toContain('aria-valuenow="0"')
    expect(html).toContain('value="09:00"')
    expect(html).not.toContain('09:07')
    expect(mismatches).toEqual([])
  })

  it('should give server and client the same markup for a model one normalizes and the other receives normalized', async () => {
    let side = 0
    const { html, mismatches } = await hydrate(() => picker(side === 1 ? '09:07' : '09:00'), {
      setup: () => {
        side++
      },
    })

    expect(html).toContain('value="09:00"')
    expect(mismatches).toEqual([])
  })
})
