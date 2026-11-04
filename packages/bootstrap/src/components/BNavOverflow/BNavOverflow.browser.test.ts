import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BNavOverflow } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'

const teardowns: (() => void)[] = []

// The suite does not load Bootstrap CSS. `.nav` is flex there, so items
// shrink to their text. Without that, each `li` is a block as wide as the
// container and every row looks overflowed.
const layout = document.createElement('style')
layout.textContent = '.nav { display: flex; gap: 8px; } .nav-link { white-space: nowrap; }'

function mount (node: () => VNode, width?: string): HTMLElement {
  document.head.append(layout)
  const host = document.createElement('div')
  if (width) host.style.width = width
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
  layout.remove()
})

function link (label: string, active = false) {
  return h(BNavOverflow.Item, () => h('a', {
    'class': active ? 'nav-link active' : 'nav-link',
    'aria-current': active ? 'page' : undefined,
    'href': '#',
  }, label))
}

function row (labels: string[], keepLast = false) {
  const items = labels.map((label, index) => {
    if (keepLast && index === labels.length - 1) {
      return h(BNavOverflow.Item, { keep: true }, () => h('a', { class: 'nav-link', href: '#' }, label))
    }
    return link(label, index === 0)
  })
  return h(BNavOverflow, () => h('ul', { class: 'nav nav-pills' }, items))
}

async function settle () {
  await nextTick()
  await nextTick()
  await new Promise(resolve => {
    requestAnimationFrame(() => resolve(null))
  })
  await nextTick()
}

describe('bNavOverflow', () => {
  it('should conform to the basic nav overflow fixture when every item fits', async () => {
    const host = mount(() => row(['Home', 'Dashboard']))
    await settle()

    conform(host.querySelector('.nav-overflow')!, 'nav-overflow:basic')
    expect(host.innerHTML).not.toContain('data-bs-toggle')
    expect(host.querySelector('.nav-overflow-text')).toBeNull()
  })

  it('should move items that do not fit into the More menu and keep a marked item', async () => {
    const host = mount(
      () => row(['Home', 'Dashboard', 'Products', 'Services', 'Analytics', 'Reports', 'Contact'], true),
      '120px',
    )
    await settle()
    await settle()

    const more = host.querySelector('.nav-overflow-text')
    expect(more).not.toBeNull()
    expect(more!.textContent).toBe('More')

    const menu = host.querySelector('.menu')
    expect(menu).not.toBeNull()
    const copied = menu!.querySelector('a')
    expect(copied).not.toBeNull()
    expect(copied!.classList.contains('menu-item')).toBe(true)
    expect(copied!.classList.contains('nav-link')).toBe(false)

    const keep = host.querySelector('.nav-overflow-keep')
    expect(keep).not.toBeNull()
    expect(getComputedStyle(keep!).display).not.toBe('none')
    expect(keep!.textContent).toContain('Contact')
    expect(host.innerHTML).not.toContain('data-bs-toggle')
  })
})
