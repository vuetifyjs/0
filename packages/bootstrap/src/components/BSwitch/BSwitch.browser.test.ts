import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BSwitch } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'

const teardowns: (() => void)[] = []

function mount (render: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render })
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

function rootOf (host: HTMLElement): HTMLElement {
  const root = host.querySelector('.switch')
  if (!(root instanceof HTMLElement)) throw new Error('missing switch')
  return root
}

describe('bSwitch', () => {
  it('should conform to the basic switch', async () => {
    const host = mount(() => h(BSwitch))
    await settle()

    const root = rootOf(host)
    const input = root.querySelector('input')

    conform(root, 'switch:basic')
    expect(root.parentElement).toBe(host)
    expect(input instanceof HTMLInputElement).toBe(true)
    expect(input?.classList.contains('check')).toBe(false)
    expect(input?.getAttribute('role')).toBe('switch')
    expect(input?.hasAttribute('switch')).toBe(true)
  })

  it('should conform when checked', async () => {
    const host = mount(() => h(BSwitch, { modelValue: true }))
    await settle()

    conform(rootOf(host), 'switch:checked')
  })

  it('should add switch-sm and switch-lg on the wrapper', async () => {
    const sm = mount(() => h(BSwitch, { size: 'sm' }))
    const lg = mount(() => h(BSwitch, { size: 'lg' }))
    await settle()

    conform(rootOf(sm), 'switch:sm')
    conform(rootOf(lg), 'switch:lg')
  })

  it('should add theme-primary on the wrapper', async () => {
    const host = mount(() => h(BSwitch, { theme: 'primary' }))
    await settle()

    conform(rootOf(host), 'switch:theme')
  })

  it('should set disabled on the input', async () => {
    const host = mount(() => h(BSwitch, { disabled: true }))
    await settle()

    conform(rootOf(host), 'switch:disabled')
  })

  it('should toggle the boolean model when clicked', async () => {
    const on = shallowRef(false)
    const host = mount(() => h(BSwitch, {
      'modelValue': on.value,
      'onUpdate:modelValue': (value: boolean) => {
        on.value = value
      },
    }))
    await settle()

    const input = rootOf(host).querySelector('input')
    if (!(input instanceof HTMLInputElement)) throw new Error('missing switch input')

    await userEvent.click(input)
    await settle()

    expect(on.value).toBe(true)
    conform(rootOf(host), 'switch:checked')
  })
})
