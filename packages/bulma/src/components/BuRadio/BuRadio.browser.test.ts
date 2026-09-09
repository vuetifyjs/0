import { describe, it } from 'vitest'

// Components
import { BuRadio } from './index'

// Utilities
import { createApp, h } from 'vue'

import { conform } from '../../../harness/conform'

function mount (render: () => ReturnType<typeof h>) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render })
  app.mount(host)
  const el = host.firstElementChild!
  function unmount () {
    app.unmount()
    host.remove()
  }
  return { el, unmount }
}

// BuRadio binds :value on the native input; the docs fixture radios are
// valueless — tolerate it explicitly.
const VALUE = { ignoreAttrs: ['value'] }

describe('buRadio', () => {
  it('should conform to the Bulma radio fixtures', () => {
    const basic = mount(() => h('div', { class: 'control' }, [
      h(BuRadio, { name: 'answer', value: 'yes' }, () => ' Yes '),
      h(BuRadio, { name: 'answer', value: 'no' }, () => ' No '),
    ]))
    conform(basic.el, 'form-radio', VALUE)
    basic.unmount()

    const disabled = mount(() => h('div', { class: 'control' }, [
      h(BuRadio, { name: 'rsvp', value: 'going' }, () => ' Going '),
      h(BuRadio, { name: 'rsvp', value: 'not-going' }, () => ' Not going '),
      h(BuRadio, { disabled: true, name: 'rsvp', value: 'maybe' }, () => ' Maybe '),
    ]))
    conform(disabled.el, 'form-radio:disabled option', VALUE)
    disabled.unmount()
  })
})
