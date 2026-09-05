// Conformance: BuInput against the form-input fixtures, plus v-model and
// modifier behavior.
import { afterEach, describe, expect, it } from 'vitest'

// Context
import BuInput from './BuInput.vue'

// Utilities
import { createApp, h, shallowRef } from 'vue'

import { conform } from '../../../harness/conform'
import { BuControl } from '../BuControl'

// v0 InputControl merges `value` in and it lands as a real attribute the
// fixture lacks — tolerate it explicitly.
const VALUE = { ignoreAttrs: ['value'] }

const cleanups: (() => void)[] = []

function mount (render: () => unknown): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render })
  app.mount(host)
  cleanups.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

afterEach(() => {
  while (cleanups.length > 0) cleanups.pop()!()
})

describe('buInput', () => {
  it('conforms to the bare input fixture', () => {
    const host = mount(() => h(BuInput, { placeholder: 'Text input' }))

    conform(host.firstElementChild!, 'form-input:basic input', VALUE)
  })

  it('conforms to the color fixture', () => {
    const host = mount(() => h(BuInput, { color: 'primary', placeholder: 'Primary input' }))

    conform(host.firstElementChild!, 'form-input:color primary', VALUE)
  })

  it('conforms to the rounded fixture', () => {
    const host = mount(() => h(BuInput, { rounded: true, placeholder: 'Rounded input' }))

    conform(host.firstElementChild!, 'form-input:style rounded', VALUE)
  })

  it('conforms to the disabled fixture', () => {
    const host = mount(() => h(BuControl, null, () => h(BuInput, { disabled: true, placeholder: 'Disabled input' })))

    conform(host.firstElementChild!, 'form-input:state disabled', VALUE)
  })

  it('updates v-model on input', () => {
    const model = shallowRef('')
    const host = mount(() => h(BuInput, {
      'modelValue': model.value,
      'onUpdate:modelValue': (value: string) => {
        model.value = value
      },
    }))

    const input = host.querySelector('input')!
    input.value = 'hello'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(model.value).toBe('hello')
  })

  it('renders is-static and readonly for plaintext', () => {
    const host = mount(() => h(BuInput, { plaintext: true }))

    const input = host.querySelector('input')!
    expect(input.classList.contains('is-static')).toBe(true)
    expect(input.hasAttribute('readonly')).toBe(true)
  })

  it('renders is-danger when error is forced', () => {
    const host = mount(() => h(BuInput, { error: true }))

    expect(host.querySelector('input')!.classList.contains('is-danger')).toBe(true)
  })
})
