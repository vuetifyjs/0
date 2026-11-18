import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BButton } from './index'

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

describe('bButton', () => {
  it('should conform to the base button fixture', async () => {
    const host = mount(() => h(BButton, () => 'Base class'))
    await settle()

    const element = host.querySelector('button')!

    conform(element, 'button:basic')
    expect(Object.hasOwn(element.dataset, 'bsToggle')).toBe(false)
  })

  it('should let a variant stand alone', async () => {
    const host = mount(() => h(BButton, { variant: 'solid', theme: 'primary', size: 'xs', icon: true }, () => 'Save'))
    await settle()

    const element = host.querySelector('button')!

    expect(element.classList.contains('btn-solid')).toBe(true)
    expect(element.classList.contains('btn')).toBe(false)
    expect(element.classList.contains('theme-primary')).toBe(true)
    expect(element.classList.contains('btn-xs')).toBe(true)
    expect(element.classList.contains('btn-icon')).toBe(true)
  })

  it('should use btn-icon alone when there is no variant', async () => {
    const host = mount(() => h(BButton, { icon: true }))
    await settle()

    const element = host.querySelector('button')!

    expect(element.classList.contains('btn-icon')).toBe(true)
    expect(element.classList.contains('btn')).toBe(false)
  })

  it('should render an anchor when href is set', async () => {
    const host = mount(() => h(BButton, { href: '#save', variant: 'solid', theme: 'primary' }, () => 'Save'))
    await settle()

    const element = host.querySelector('a')!

    conform(element, 'button:anchor')
    expect(element.hasAttribute('type')).toBe(false)
  })

  it('should disable a button natively and an anchor with aria', async () => {
    const host = mount(() => h('div', () => [
      h(BButton, { disabled: true }, () => 'Stop'),
      h(BButton, { href: '#stop', disabled: true }, () => 'Stop'),
    ]))
    await settle()

    const button = host.querySelector('button')!
    const anchor = host.querySelector('a')!

    expect(button.disabled).toBe(true)
    expect(button.hasAttribute('aria-disabled')).toBe(false)
    expect(anchor.getAttribute('aria-disabled')).toBe('true')
    expect(anchor.classList.contains('disabled')).toBe(true)
    expect(anchor.hasAttribute('href')).toBe(true)
    expect(anchor.getAttribute('tabindex')).toBe('-1')
    expect(anchor.hasAttribute('disabled')).toBe(false)
  })

  it('should set the submit type only on a button', async () => {
    const host = mount(() => h(BButton, { type: 'submit' }, () => 'Send'))
    await settle()

    expect(host.querySelector('button')!.type).toBe('submit')
  })
})
