import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { BRadio } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { BRadioValue } from './index'
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

function inputOf (host: HTMLElement, index = 0): HTMLInputElement {
  const input = host.querySelectorAll('input')[index]
  if (!(input instanceof HTMLInputElement)) throw new Error('missing radio')
  return input
}

describe('bRadio', () => {
  it('should conform to the basic radio', async () => {
    const host = mount(() => h(BRadio))
    await settle()

    const input = inputOf(host)

    conform(input, 'radio:basic')
    expect(input.parentElement).toBe(host)
  })

  it('should conform when the model matches value', async () => {
    const host = mount(() => h(BRadio, { modelValue: 'a', value: 'a' }))
    await settle()

    conform(inputOf(host), 'radio:checked')
  })

  it('should add radio-sm and radio-lg on the input', async () => {
    const sm = mount(() => h(BRadio, { size: 'sm' }))
    const lg = mount(() => h(BRadio, { size: 'lg' }))
    await settle()

    conform(inputOf(sm), 'radio:sm')
    conform(inputOf(lg), 'radio:lg')
  })

  it('should add theme-primary on the input', async () => {
    const host = mount(() => h(BRadio, { theme: 'primary' }))
    await settle()

    conform(inputOf(host), 'radio:theme')
  })

  it('should set the disabled attribute', async () => {
    const host = mount(() => h(BRadio, { disabled: true }))
    await settle()

    conform(inputOf(host), 'radio:disabled')
  })

  it('should share one model across a named group', async () => {
    const choice = shallowRef<BRadioValue | null>(null)
    const host = mount(() => h('div', [
      h(BRadio, {
        'modelValue': choice.value,
        'name': 'radios',
        'value': 'a',
        'onUpdate:modelValue': (value: BRadioValue | null | undefined) => {
          choice.value = value ?? null
        },
      }),
      h(BRadio, {
        'modelValue': choice.value,
        'name': 'radios',
        'value': 'b',
        'onUpdate:modelValue': (value: BRadioValue | null | undefined) => {
          choice.value = value ?? null
        },
      }),
    ]))
    await settle()

    expect(inputOf(host, 0).name).toBe('radios')
    expect(inputOf(host, 1).name).toBe('radios')

    await userEvent.click(inputOf(host, 1))
    await settle()

    expect(choice.value).toBe('b')
    expect(inputOf(host, 0).checked).toBe(false)
    expect(inputOf(host, 1).checked).toBe(true)
  })
})
