// Conformance: BuField layouts against the form-general fixtures.
import { afterEach, describe, it } from 'vitest'

// Context
import BuField from './BuField.vue'

// Utilities
import { createApp, h } from 'vue'

import { conform } from '../../../harness/conform'
import { BuControl } from '../BuControl'
import { BuHelp } from '../BuHelp'
import { BuInput } from '../BuInput'
import { BuLabel } from '../BuLabel'

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

// v0 InputControl merges `value` in and it lands as a real attribute the
// fixture lacks — tolerate it explicitly.
const VALUE = { ignoreAttrs: ['value'] }

describe('buField', () => {
  it('conforms to the basic field fixture', () => {
    const host = mount(() => h(BuField, null, () => [
      h(BuLabel, null, () => 'Label'),
      h(BuControl, null, () => h(BuInput, { placeholder: 'Text input' })),
      h(BuHelp, null, () => 'This is a help text'),
    ]))

    conform(host.firstElementChild!, 'form-general:basic field', VALUE)
  })

  it('conforms to the addons fixture', () => {
    const host = mount(() => h(BuField, { addons: true }, () => [
      h(BuControl, null, () => h(BuInput, { placeholder: 'Find a repository' })),
      h(BuControl, null, () => h('button', { class: 'button is-info' }, 'Search')),
    ]))

    conform(host.firstElementChild!, 'form-general:addons', VALUE)
  })

  it('conforms to the grouped fixture', () => {
    const host = mount(() => h(BuField, { grouped: true }, () => [
      h(BuControl, { as: 'p' }, () => h('button', { class: 'button is-primary' }, 'Submit')),
      h(BuControl, { as: 'p' }, () => h('a', { class: 'button is-light' }, 'Cancel')),
    ]))

    conform(host.firstElementChild!, 'form-general:grouped controls')
  })

  it('conforms to the horizontal fixture', () => {
    const host = mount(() => h(BuField, { horizontal: true, size: 'normal' }, {
      label: () => h(BuLabel, null, () => 'Subject'),
      default: () => h(BuField, null, () => [
        h(BuControl, null, () => h(BuInput, { color: 'danger', placeholder: 'e.g. Partnership opportunity' })),
        h(BuHelp, { color: 'danger' }, () => 'This field is required'),
      ]),
    }))

    conform(host.firstElementChild!, 'form-general:horizontal form', VALUE)
  })
})
