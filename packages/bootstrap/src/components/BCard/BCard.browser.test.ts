import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BCard } from './index'

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

describe('bCard', () => {
  it('should conform to the basic card fixture', async () => {
    const host = mount(() => h(BCard, () => [
      h(BCard.Body, () => [
        h(BCard.Title, () => 'Card title'),
        h(BCard.Text, () => 'Some quick example text.'),
      ]),
    ]))
    await settle()

    conform(host.querySelector('section')!, 'card:basic')
    expect(host.querySelector('footer')).toBeNull()
  })

  it('should render a header and the variant classes', async () => {
    const host = mount(() => h(BCard, { as: 'div', subtle: true, translucent: true }, () => [
      h(BCard.Header, () => 'Featured'),
    ]))
    await settle()

    const element = host.querySelector('div.card')!

    expect(element.classList.contains('card-subtle')).toBe(true)
    expect(element.classList.contains('card-translucent')).toBe(true)
    expect(element.querySelector('.card-header')!.textContent).toBe('Featured')
  })
})
