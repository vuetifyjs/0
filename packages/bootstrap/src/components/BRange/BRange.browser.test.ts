import { afterEach, describe, expect, it } from 'vitest'

// Framework
import { isNumber } from '@vuetify/v0'

import { BRange } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('bRange', () => {
  it('should conform to the basic range fixture', async () => {
    const host = mount(() => h(BRange))
    await settle()

    conform(host.querySelector('.form-range')!, 'range:basic')
    expect(host.innerHTML).not.toContain('data-bs-bubble')
  })

  it('should conform to the disabled range fixture', async () => {
    const host = mount(() => h(BRange, { disabled: true }))
    await settle()

    conform(host.querySelector('.form-range')!, 'range:disabled')
  })

  it('should conform to min, max, and step', async () => {
    const host = mount(() => h(BRange, { min: 0, max: 5, step: 0.5 }))
    await settle()

    conform(host.querySelector('.form-range')!, 'range:step')
  })

  it('should write the snapped thumb into the model', async () => {
    const model = shallowRef(0)
    const host = mount(() => h(BRange, {
      'modelValue': model.value,
      'onUpdate:modelValue': (value: number | undefined) => {
        if (isNumber(value)) model.value = value
      },
    }))
    await settle()

    const input = host.querySelector('input')!
    input.value = '25'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()

    expect(model.value).toBe(25)
  })
})
