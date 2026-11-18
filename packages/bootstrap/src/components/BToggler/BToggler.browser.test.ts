import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BToggler } from './index'

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

describe('bToggler', () => {
  it('should conform, then toggle a class and aria-pressed on itself', async () => {
    const host = mount(() => h(BToggler, { value: 'fg-danger' }, () => 'Click to toggle fg-danger'))
    await settle()

    const root = host.querySelector('div')!
    conform(root, 'toggler:root')
    expect(host.innerHTML).not.toContain('data-bs-toggle')
    expect(host.innerHTML).not.toContain('data-bs-value')
    expect(root.getAttribute('aria-pressed')).toBe('false')

    await userEvent.click(root)
    await settle()

    expect(root.classList.contains('fg-danger')).toBe(true)
    expect(root.getAttribute('aria-pressed')).toBe('true')

    await userEvent.click(root)
    await settle()

    expect(root.classList.contains('fg-danger')).toBe(false)
    expect(root.getAttribute('aria-pressed')).toBe('false')
  })

  it('should toggle a class on a target id', async () => {
    const host = mount(() => h('div', [
      h(BToggler, { as: 'button', target: 'toggler-box', value: 'bg-2' }, () => 'Toggle'),
      h('div', { id: 'toggler-box' }, 'Use button'),
    ]))
    await settle()

    const button = host.querySelector('button')!
    const box = host.querySelector('#toggler-box')!

    expect(button.getAttribute('type')).toBe('button')
    expect(box.classList.contains('bg-2')).toBe(false)

    await userEvent.click(button)
    await settle()

    expect(box.classList.contains('bg-2')).toBe(true)
    expect(button.getAttribute('aria-pressed')).toBe('true')
  })

  it('should toggle an attribute and skip aria-pressed', async () => {
    const host = mount(() => h(BToggler, { attribute: 'hidden', value: 'true' }, () => 'Hide'))
    await settle()

    const root = host.querySelector('div')!
    expect(root.hasAttribute('aria-pressed')).toBe(false)

    await userEvent.click(root)
    await settle()

    expect(root.getAttribute('hidden')).toBe('true')

    root.click()
    await settle()

    expect(root.hasAttribute('hidden')).toBe(false)
  })
})
