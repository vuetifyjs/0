import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BBadge } from './index'

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

describe('bBadge', () => {
  it('should conform to the basic badge fixture', async () => {
    const host = mount(() => h(BBadge, () => 'New'))
    await settle()

    conform(host.querySelector('span')!, 'badge:basic')
  })

  it('should add the subtle face and a theme', async () => {
    const host = mount(() => h(BBadge, { variant: 'subtle', theme: 'primary' }, () => 'New'))
    await settle()

    const element = host.querySelector('span')!

    expect(element.classList.contains('badge')).toBe(true)
    expect(element.classList.contains('badge-subtle')).toBe(true)
    expect(element.classList.contains('theme-primary')).toBe(true)
  })

  it('should add the outline face', async () => {
    const host = mount(() => h(BBadge, { variant: 'outline' }, () => 'New'))
    await settle()

    expect(host.querySelector('span')!.classList.contains('badge-outline')).toBe(true)
  })
})
