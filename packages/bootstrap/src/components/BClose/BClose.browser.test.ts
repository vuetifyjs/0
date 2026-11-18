import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BClose } from './index'

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
  await nextTick()
}

describe('bClose', () => {
  it('should conform to the empty close button', async () => {
    const host = mount(() => h(BClose))
    await settle()

    const element = host.querySelector('button')!

    conform(element, 'close:basic')
    expect(element.getAttribute('aria-label')).toBe('Close')
    expect(element.childElementCount).toBe(0)
    expect(Object.hasOwn(element.dataset, 'bsDismiss')).toBe(false)
  })

  it('should set the disabled attribute', async () => {
    const host = mount(() => h(BClose, { disabled: true }))
    await settle()

    expect(host.querySelector('button')!.disabled).toBe(true)
  })
})
