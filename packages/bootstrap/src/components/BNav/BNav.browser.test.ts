import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BNav } from './index'

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

describe('bNav', () => {
  it('should conform to the basic nav fixture', async () => {
    const host = mount(() => h(BNav, () => [
      h(BNav.Item, () => h(BNav.Link, { active: true, href: '#home' }, () => 'Active')),
      h(BNav.Item, () => h(BNav.Link, { href: '#link' }, () => 'Link')),
    ]))
    await settle()

    const element = host.querySelector('ul')!

    conform(element, 'nav:basic')
    expect(element.querySelector('[role="tab"]')).toBeNull()
  })

  it('should mark a disabled link and drop its href', async () => {
    const host = mount(() => h(BNav, () => [
      h(BNav.Item, () => h(BNav.Link, { disabled: true, href: '#nope' }, () => 'Disabled')),
    ]))
    await settle()

    const link = host.querySelector('a')!

    expect(link.classList.contains('disabled')).toBe(true)
    expect(link.getAttribute('aria-disabled')).toBe('true')
    expect(link.hasAttribute('href')).toBe(false)
    expect(link.getAttribute('tabindex')).toBe('-1')
  })

  it('should add pills, vertical, fill, and justified classes', async () => {
    const host = mount(() => h(BNav, { variant: 'pills', vertical: true, fill: true, justified: true }))
    await settle()

    const element = host.querySelector('ul')!

    expect(element.classList.contains('nav-pills')).toBe(true)
    expect(element.classList.contains('nav-pills-vertical')).toBe(true)
    expect(element.classList.contains('nav-tabs')).toBe(false)
    expect(element.classList.contains('nav-fill')).toBe(true)
    expect(element.classList.contains('nav-justified')).toBe(true)
  })

  it('should render a nav element for the flat list', async () => {
    const host = mount(() => h(BNav, { as: 'nav', variant: 'underline' }, () => [
      h(BNav.Link, { href: '#link' }, () => 'Link'),
    ]))
    await settle()

    const element = host.querySelector('nav')!

    expect(element.classList.contains('nav-underline')).toBe(true)
    expect(element.querySelector('li')).toBeNull()
  })
})
