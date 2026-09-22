// Conformance: BuControl icon and loading modifiers against the fixtures.
import { afterEach, describe, it } from 'vitest'

// Context
import BuControl from './BuControl.vue'

// Utilities
import { createApp, h } from 'vue'

import { conform } from '../../../harness/conform'
import { BuField } from '../BuField'
import { BuInput } from '../BuInput'

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

function icon (side: string, glyph: string) {
  return h('span', { class: `icon is-small is-${side}` }, h('i', { class: `fas fa-${glyph}` }))
}

// v0 InputControl merges `value` in and it lands as a real attribute the
// fixture lacks — tolerate it explicitly.
const VALUE = { ignoreAttrs: ['value'] }

describe('buControl', () => {
  it('conforms to the icons fixture', () => {
    const host = mount(() => h(BuField, null, () => h(BuControl, { as: 'p', icons: 'both' }, () => [
      h(BuInput, { type: 'email', placeholder: 'Email' }),
      icon('left', 'envelope'),
      icon('right', 'check'),
    ])))

    conform(host.firstElementChild!, 'form-general:control icons', VALUE)
  })

  it('conforms to the loading fixture with size duplicated on the control', () => {
    const host = mount(() => h(BuField, null, () => h(BuControl, { loading: true, size: 'small' }, () => (
      h(BuInput, { size: 'small', placeholder: 'Small loading input' })
    ))))

    conform(host.firstElementChild!, 'form-input:loading sizing', VALUE)
  })
})
