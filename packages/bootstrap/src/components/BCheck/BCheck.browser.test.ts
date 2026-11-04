import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BCheck } from './index'

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

function inputOf (host: HTMLElement): HTMLInputElement {
  const input = host.querySelector('input')
  if (!(input instanceof HTMLInputElement)) throw new Error('missing checkbox')
  return input
}

describe('bCheck', () => {
  it('should conform to the basic checkbox', async () => {
    const host = mount(() => h(BCheck))
    await settle()

    const input = inputOf(host)

    conform(input, 'check:basic')
    expect(input.parentElement).toBe(host)
  })

  it('should conform when checked', async () => {
    const host = mount(() => h(BCheck, { modelValue: true }))
    await settle()

    conform(inputOf(host), 'check:checked')
  })

  it('should add check-sm and check-lg on the input', async () => {
    const sm = mount(() => h(BCheck, { modelValue: true, size: 'sm' }))
    const lg = mount(() => h(BCheck, { size: 'lg' }))
    await settle()

    conform(inputOf(sm), 'check:sm')
    conform(inputOf(lg), 'check:lg')
  })

  it('should add theme-primary on the input', async () => {
    const host = mount(() => h(BCheck, { modelValue: true, theme: 'primary' }))
    await settle()

    conform(inputOf(host), 'check:theme')
  })

  it('should set the disabled attribute', async () => {
    const host = mount(() => h(BCheck, { disabled: true }))
    await settle()

    conform(inputOf(host), 'check:disabled')
  })

  it('should set indeterminate on mount and when it changes', async () => {
    const flag = shallowRef(true)
    const host = mount(() => h(BCheck, { indeterminate: flag.value }))
    await settle()

    const input = inputOf(host)

    conform(input, 'check:basic')
    expect(input.hasAttribute('indeterminate')).toBe(false)
    expect(input.indeterminate).toBe(true)

    flag.value = false
    await settle()

    expect(input.indeterminate).toBe(false)
  })

  it('should toggle the boolean model when clicked', async () => {
    const agreed = shallowRef(false)
    const host = mount(() => h(BCheck, {
      'modelValue': agreed.value,
      'onUpdate:modelValue': (value: boolean) => {
        agreed.value = value
      },
    }))
    await settle()

    await userEvent.click(inputOf(host))
    await settle()

    expect(agreed.value).toBe(true)
    conform(inputOf(host), 'check:checked')
  })
})
