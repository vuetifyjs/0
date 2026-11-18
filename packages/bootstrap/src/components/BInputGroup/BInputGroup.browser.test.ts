import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BInputGroup } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'

const teardowns: (() => void)[] = []

function mount (render: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render })
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

describe('bInputGroup', () => {
  it('should conform to the basic input group', async () => {
    const host = mount(() => h(BInputGroup, () => [
      h(BInputGroup.Text, () => '@'),
    ]))
    await settle()

    const root = host.querySelector('.input-group')
    if (!(root instanceof HTMLElement)) throw new Error('missing input group')

    conform(root, 'input-group:basic')
    expect(root.parentElement).toBe(host)

    const text = root.querySelector('.input-group-text')
    expect(text instanceof HTMLSpanElement).toBe(true)
    expect(text?.textContent).toBe('@')
  })
})
