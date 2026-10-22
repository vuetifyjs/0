import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { BCarousel } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'
// Components
import { BCarouselItem } from '../BCarouselItem'

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

function slides () {
  return [
    h(BCarouselItem, () => 'First slide'),
    h(BCarouselItem, () => 'Second slide'),
  ]
}

function example (extra: { fade?: boolean } = {}) {
  return () => h(BCarousel, extra, () => slides())
}

async function settle () {
  await nextTick()
  await nextTick()
}

describe('bCarousel', () => {
  it('should conform to the stacked carousel fixture', async () => {
    const host = mount(example())
    await settle()

    conform(host.querySelector('.carousel')!, 'carousel:basic')
  })

  it('should add carousel-fade when fade is set', async () => {
    const host = mount(example({ fade: true }))
    await settle()

    conform(host.querySelector('.carousel')!, 'carousel:fade')
  })

  it('should advance to the next slide on an autoplay interval', async () => {
    const host = mount(() => h(BCarousel, { autoplay: 40 }, () => slides()))
    await settle()

    const items = host.querySelectorAll('.carousel-item')
    expect(items[0]?.classList.contains('active')).toBe(true)

    await new Promise(resolve => {
      setTimeout(resolve, 120)
    })
    await settle()

    expect(items[1]?.classList.contains('active')).toBe(true)
  })

  it('should move .active to the second item from the next button', async () => {
    const host = mount(example())
    await settle()

    const items = host.querySelectorAll('.carousel-item')
    expect(items[0]?.classList.contains('active')).toBe(true)
    expect(items[1]?.classList.contains('active')).toBe(false)

    const next = host.querySelector('.carousel-icon-next')!.closest('button')!
    await userEvent.click(next)
    await settle()

    expect(items[0]?.classList.contains('active')).toBe(false)
    expect(items[1]?.classList.contains('active')).toBe(true)
  })

  it('should move slides from the arrow keys', async () => {
    const host = mount(example())
    await settle()

    const next = host.querySelector('.carousel-icon-next')!.closest('button')!
    next.focus()
    await userEvent.keyboard('{ArrowRight}')
    await settle()

    const items = host.querySelectorAll('.carousel-item')
    expect(items[1]?.classList.contains('active')).toBe(true)

    await userEvent.keyboard('{ArrowLeft}')
    await settle()

    expect(items[0]?.classList.contains('active')).toBe(true)
    expect(items[1]?.classList.contains('active')).toBe(false)
  })
})
