import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BFormFeedback } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
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
}

describe('bFormFeedback', () => {
  it('should conform to the invalid feedback fixture', async () => {
    const host = mount(() => h(BFormFeedback, { id: 'validationCustom01Feedback' }, () => 'Full name is required'))
    await settle()

    conform(host.querySelector('div')!, 'form-feedback:is-invalid')
  })

  it('should conform to the valid feedback fixture', async () => {
    const host = mount(() => h(BFormFeedback, { id: 'validationServer01Valid', valid: true }, () => 'Looks great!'))
    await settle()

    conform(host.querySelector('div')!, 'form-feedback:is-valid')
  })

  it('should not render both feedback classes at once', async () => {
    const host = mount(() => h(BFormFeedback, { valid: true }))
    await settle()

    const element = host.querySelector('div')!

    expect(element.classList.contains('valid-feedback')).toBe(true)
    expect(element.classList.contains('invalid-feedback')).toBe(false)
  })
})
