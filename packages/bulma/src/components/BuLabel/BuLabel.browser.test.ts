// Conformance: BuLabel inside the horizontal is-static fixture, plus wired
// `for` resolution from an ambient Input.Root context.
import { afterEach, describe, expect, it } from 'vitest'

// Framework
import { InputRoot } from '@vuetify/v0'

// Context
import BuLabel from './BuLabel.vue'

// Utilities
import { createApp, h } from 'vue'

import { conform } from '../../../harness/conform'
import { BuControl } from '../BuControl'
import { BuField } from '../BuField'
import { BuFieldBody } from '../BuFieldBody'
import { BuFieldLabel } from '../BuFieldLabel'
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

describe('buLabel', () => {
  it('conforms to the horizontal is-static fixture', () => {
    const host = mount(() => h(BuField, { horizontal: true }, () => [
      h(BuFieldLabel, { size: 'normal' }, () => h(BuLabel, null, () => 'From')),
      h(BuFieldBody, null, () => h(BuField, null, () => h(BuControl, { as: 'p' }, () => (
        h(BuInput, { plaintext: true, type: 'email', modelValue: 'me@example.com' })
      )))),
    ]))

    // `value` lands as a DOM property, not an attribute — skip it on both sides
    conform(host.firstElementChild!, 'form-input:static', { ignoreAttrs: ['value'] })
  })

  it('resolves `for` from an ambient Input.Root context', () => {
    const host = mount(() => h(InputRoot, { renderless: true, id: 'email-1' }, () => [
      h(BuLabel, null, () => 'Email'),
      h(BuControl, null, () => h(BuInput)),
    ]))

    const label = host.querySelector('label.label')!
    expect(label.getAttribute('for')).toBe('email-1')
    expect(host.querySelector('input')!.id).toBe('email-1')
  })

  it('prefers an explicit `for` prop', () => {
    const host = mount(() => h(BuLabel, { for: 'other' }, () => 'Name'))

    expect(host.querySelector('label.label')!.getAttribute('for')).toBe('other')
  })
})
