import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BRow } from './index'

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

describe('bRow', () => {
  it('should conform to a plain row', async () => {
    const host = mount(() => h(BRow, () => 'Columns'))
    await settle()

    conform(host.querySelector('.row')!, 'row:basic')
  })

  it('should add row-cols-N for 1 through 6', async () => {
    const host = mount(() => h(BRow, { cols: 3 }, () => 'Columns'))
    await settle()

    conform(host.querySelector('.row')!, 'row:cols')
  })

  it('should ignore a cols value outside 1 through 6', async () => {
    const host = mount(() => h(BRow, { cols: 7 }, () => 'Columns'))
    await settle()

    const row = host.querySelector('.row')!
    expect(row.className).toBe('row')
  })
})
