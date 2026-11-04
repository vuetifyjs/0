import { afterEach, describe, expect, it } from 'vitest'

import { BContainer } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'
// Components
import { BCol } from '../BCol'
import { BRow } from '../BRow'

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

describe('bContainer', () => {
  it('should conform to the container, row, and column fixture', async () => {
    const host = mount(() => h(BContainer, () => [
      h(BRow, () => [
        h(BCol, () => 'One of three columns'),
        h(BCol, { md: 6 }, () => 'One of three columns'),
        h(BCol, () => 'One of three columns'),
      ]),
    ]))
    await settle()

    conform(host.querySelector('.container')!, 'container:basic')
  })

  it('should use container-fluid when fluid is set', async () => {
    const host = mount(() => h(BContainer, { fluid: true }, () => 'Fluid'))
    await settle()

    conform(host.querySelector('.container-fluid')!, 'container:fluid')
  })

  it('should use the colon breakpoint container', async () => {
    const host = mount(() => h(BContainer, { breakpoint: 'md' }, () => 'Wide until md'))
    await settle()

    const root = host.firstElementChild!
    conform(root, 'container:breakpoint')
    expect(root.classList.contains('container')).toBe(false)
  })
})
