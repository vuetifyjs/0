import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BScrollSpy } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'

const COPY = 'This is some placeholder content for the scrollspy page.'

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

function example (smooth = false) {
  return h(BScrollSpy, { class: 'vh-100 overflow-auto', tabindex: 0, smooth }, () => [
    h('nav', { class: 'nav nav-pills mb-3' }, [
      h(BScrollSpy.Link, { id: 'one' }, () => 'First'),
      h(BScrollSpy.Link, { id: 'two' }, () => 'Second'),
    ]),
    h(BScrollSpy.Section, { id: 'one', class: 'min-vh-100' }, () => [
      h('h4', 'First heading'),
      h('p', { class: 'mb-3' }, COPY),
    ]),
    h(BScrollSpy.Section, { id: 'two', class: 'min-vh-100' }, () => [
      h('h4', 'Second heading'),
      h('p', { class: 'mb-3' }, COPY),
    ]),
  ])
}

async function settle () {
  await nextTick()
  await nextTick()
  await new Promise(resolve => {
    requestAnimationFrame(() => resolve(null))
  })
}

describe('bScrollSpy', () => {
  it('should conform to the basic scrollspy fixture', async () => {
    const host = mount(() => example())
    await settle()

    conform(host.firstElementChild!, 'scrollspy:basic')
    expect(host.innerHTML).not.toContain('data-bs-spy')
    expect(host.innerHTML).not.toContain('data-bs-target')
  })

  it('should smooth-scroll only when smooth is set', async () => {
    const spy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {})
    const host = mount(() => example(true))
    await settle()

    await userEvent.click(host.querySelector('[href="#two"]')!)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ behavior: 'smooth' })
    spy.mockRestore()
  })

  it('should mark the section in view', async () => {
    const host = mount(() => h(BScrollSpy, {
      style: 'height: 160px; overflow: auto',
      tabindex: 0,
    }, () => [
      h('nav', { class: 'nav nav-pills mb-3' }, [
        h(BScrollSpy.Link, { id: 'one' }, () => 'First'),
        h(BScrollSpy.Link, { id: 'two' }, () => 'Second'),
      ]),
      h(BScrollSpy.Section, { id: 'one', style: 'height: 320px' }, () => [
        h('h4', 'First heading'),
        h('p', { class: 'mb-3' }, COPY),
      ]),
      h(BScrollSpy.Section, { id: 'two', style: 'height: 320px' }, () => [
        h('h4', 'Second heading'),
        h('p', { class: 'mb-3' }, COPY),
      ]),
    ]))
    await settle()

    const scroller = host.firstElementChild as HTMLElement
    scroller.scrollTop = scroller.scrollHeight
    await vi.waitFor(() => {
      const links = host.querySelectorAll('a.nav-link')
      expect(links[1]!.classList.contains('active')).toBe(true)
      expect(links[0]!.classList.contains('active')).toBe(false)
    })
  })
})
