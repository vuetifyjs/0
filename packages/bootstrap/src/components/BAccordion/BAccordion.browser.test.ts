import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BAccordion } from './index'

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

function item (label: string, body: string, open = false) {
  return h(BAccordion.Item, open ? { open: true } : {}, () => [
    h(BAccordion.Header, () => label),
    h(BAccordion.Body, () => body),
  ])
}

describe('bAccordion', () => {
  it('should conform to the basic accordion fixture', async () => {
    const host = mount(() => h(BAccordion, { name: 'accordion' }, () => [
      item('Accordion Item #1', 'First', true),
      item('Accordion Item #2', 'Second'),
    ]))
    await settle()

    const element = host.querySelector<HTMLElement>('.accordion')!
    const items = element.querySelectorAll('details')

    conform(element, 'accordion:basic')
    expect(items).toHaveLength(2)
    expect(items[0].hasAttribute('open')).toBe(true)
    expect(items[1].hasAttribute('open')).toBe(false)
    expect(items[0].getAttribute('name')).toBe('accordion')
    expect(items[1].getAttribute('name')).toBe('accordion')
    expect(items[0].querySelector('svg.accordion-icon')).not.toBeNull()
  })

  it('should give both items the same generated name', async () => {
    const host = mount(() => h(BAccordion, () => [
      item('One', 'First'),
      item('Two', 'Second'),
    ]))
    await settle()

    const items = host.querySelectorAll('details')
    const name = items[0].getAttribute('name')

    expect(name).toBeTruthy()
    expect(items[1].getAttribute('name')).toBe(name)
  })

  it('should omit name when exclusive is false', async () => {
    const host = mount(() => h(BAccordion, { exclusive: false }, () => [
      item('One', 'First', true),
      item('Two', 'Second', true),
    ]))
    await settle()

    const items = host.querySelectorAll('details')

    expect(items[0].hasAttribute('name')).toBe(false)
    expect(items[1].hasAttribute('name')).toBe(false)
    expect(items[0].hasAttribute('open')).toBe(true)
    expect(items[1].hasAttribute('open')).toBe(true)
  })

  it('should add theme and small classes', async () => {
    const host = mount(() => h(BAccordion, { theme: 'primary', small: true }, () => [
      item('One', 'First', true),
    ]))
    await settle()

    const element = host.querySelector('.accordion')!

    expect(element.classList.contains('theme-primary')).toBe(true)
    expect(element.classList.contains('accordion-sm')).toBe(true)
  })
})
