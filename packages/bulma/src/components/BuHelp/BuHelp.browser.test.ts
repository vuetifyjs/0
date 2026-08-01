// Conformance: BuHelp in the validation-state fixture, plus wired error mode
// through a renderless Input.Error inside an ambient Input.Root context.
import { afterEach, describe, expect, it } from 'vitest'

// Framework
import { InputRoot } from '@vuetify/v0'

// Context
import BuHelp from './BuHelp.vue'

// Utilities
import { createApp, h, nextTick } from 'vue'

import { conform } from '../../../harness/conform'
import { BuControl } from '../BuControl'
import { BuField } from '../BuField'
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

function icon (side: string, glyph: string) {
  return h('span', { class: `icon is-small is-${side}` }, h('i', { class: `fas fa-${glyph}` }))
}

describe('buHelp', () => {
  it('conforms to the validation state fixture', () => {
    const host = mount(() => h(BuField, null, () => [
      h(BuLabel, null, () => 'Email'),
      h(BuControl, { icons: 'both' }, () => [
        h(BuInput, { color: 'danger', type: 'email', placeholder: 'Email input', modelValue: 'hello@' }),
        icon('left', 'envelope'),
        icon('right', 'exclamation-triangle'),
      ]),
      h(BuHelp, { color: 'danger' }, () => 'This email is invalid'),
    ]))

    // `value` lands as a DOM property, not an attribute — skip it on both sides
    conform(host.firstElementChild!, 'form-general:validation state', { ignoreAttrs: ['value'] })
  })

  it('wires error mode to the ambient Input.Root via Input.Error', async () => {
    const host = mount(() => h(
      InputRoot,
      { renderless: true, id: 'field', error: true, errorMessages: 'This email is invalid' },
      () => [
        h(BuControl, null, () => h(BuInput)),
        h(BuHelp, { validation: true }),
      ],
    ))

    // Input.Error registers after the control's first render — wait one tick
    // for aria-errormessage to appear
    await nextTick()

    const help = host.querySelector('p.help')!
    expect(help.classList.contains('is-danger')).toBe(true)
    expect(help.textContent).toBe('This email is invalid')
    expect(help.id).toBe('field-error')
    expect(help.getAttribute('aria-live')).toBe('polite')

    // Error registration surfaces aria-errormessage + is-danger on the control
    const input = host.querySelector('input')!
    expect(input.getAttribute('aria-errormessage')).toBe('field-error')
    expect(input.classList.contains('is-danger')).toBe(true)
  })

  it('renders plain help text without an ambient context', () => {
    const host = mount(() => h(BuHelp, null, () => 'This is a help text'))

    const help = host.querySelector('p.help')!
    expect(help.textContent).toBe('This is a help text')
    expect(help.classList.contains('is-danger')).toBe(false)
  })
})
