import { describe, it } from 'vitest'

// Components
import { BuCheckbox } from './index'

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

describe('buCheckbox', () => {
  it('should conform to the Bulma checkbox fixtures', () => {
    const basic = mount(() => h(BuCheckbox, () => ' Remember me '))
    conform(basic.el, 'form-checkbox')
    basic.unmount()

    const disabled = mount(() => h(BuCheckbox, { disabled: true }, () => ' Save my preferences '))
    conform(disabled.el, 'form-checkbox:disabled')
    disabled.unmount()
  })
})
