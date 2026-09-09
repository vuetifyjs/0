import { describe, it } from 'vitest'

// Components
import { BuSelect } from './index'

// Utilities
import { createApp, h } from 'vue'

import { conform } from '../../../harness/conform'

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador',
  'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela',
]

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

describe('buSelect', () => {
  it('should conform to the Bulma select fixtures', () => {
    const basic = mount(() => h(BuSelect, () => [
      h('option', 'Select dropdown'),
      h('option', 'With options'),
    ]))
    conform(basic.el, 'form-select')
    basic.unmount()

    const multiple = mount(() => h(
      BuSelect,
      { modelValue: [], multiple: true, rows: 8 },
      () => COUNTRIES.map(country => h('option', { value: country }, country)),
    ))
    conform(multiple.el, 'form-select:multiple select')
    multiple.unmount()
  })
})
