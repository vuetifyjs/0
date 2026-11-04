import { afterEach, describe, it } from 'vitest'

// Components
import { BCol } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { BColProps } from './BCol.vue'
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

function column (props: BColProps, text: string) {
  return () => h(BCol, props, () => text)
}

describe('bCol', () => {
  it('should conform to a plain column', async () => {
    const host = mount(column({}, 'One'))
    await settle()

    conform(host.querySelector('.col')!, 'col:basic')
  })

  it('should use col-N instead of col when span is set', async () => {
    const host = mount(column({ span: 6 }, 'Six'))
    await settle()

    conform(host.firstElementChild!, 'col:span')
  })

  it('should use the md colon utility', async () => {
    const host = mount(column({ md: 6 }, 'Mid'))
    await settle()

    conform(host.querySelector('.col')!, 'col:md')
  })

  it('should add breakpoint columns and offset', async () => {
    const host = mount(column({ sm: 4, lg: 8, offset: 2 }, 'Offset'))
    await settle()

    conform(host.querySelector('.col')!, 'col:offset')
  })
})
