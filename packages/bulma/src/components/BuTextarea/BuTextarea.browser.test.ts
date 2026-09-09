// Conformance: BuTextarea against the form-textarea fixtures, plus v-model
// behavior.
import { afterEach, describe, expect, it } from 'vitest'

// Context
import BuTextarea from './BuTextarea.vue'

// Utilities
import { createApp, h, shallowRef } from 'vue'

import { conform } from '../../../harness/conform'
import { BuControl } from '../BuControl'

// v0's InputControl defaults `type` from its root and Vue writes it as a real
// attribute on <textarea> where it is invalid — upstream wart, v0-core
// follow-up. Tolerate it explicitly instead of blanket-allowing extras.
const TYPE = { ignoreAttrs: ['type', 'value'] }

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

describe('buTextarea', () => {
  it('conforms to the bare textarea fixture', () => {
    const host = mount(() => h(BuTextarea, { placeholder: 'e.g. Hello world' }))

    conform(host.firstElementChild!, 'form-textarea:basic textarea', TYPE)
  })

  it('conforms to the rows fixture', () => {
    const host = mount(() => h(BuTextarea, { placeholder: '10 lines of textarea', rows: '10' }))

    conform(host.firstElementChild!, 'form-textarea:rows attribute', TYPE)
  })

  it('conforms to the color fixture', () => {
    const host = mount(() => h(BuTextarea, { color: 'danger', placeholder: 'Danger textarea' }))

    conform(host.firstElementChild!, 'form-textarea:color danger', TYPE)
  })

  it('conforms to the fixed size fixture', () => {
    const host = mount(() => h(BuControl, null, () => h(BuTextarea, { fixed: true, placeholder: 'Fixed size textarea' })))

    conform(host.firstElementChild!, 'form-textarea:fixed size', TYPE)
  })

  it('updates v-model on input', () => {
    const model = shallowRef('')
    const host = mount(() => h(BuTextarea, {
      'modelValue': model.value,
      'onUpdate:modelValue': (value: string) => {
        model.value = value
      },
    }))

    const textarea = host.querySelector('textarea')!
    textarea.value = 'hello'
    textarea.dispatchEvent(new Event('input', { bubbles: true }))

    expect(model.value).toBe('hello')
  })
})
