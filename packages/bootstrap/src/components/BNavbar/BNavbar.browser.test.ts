import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createStackPlugin } from '@vuetify/v0'

// Components
import { BNavbar } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'
import { BDrawer } from '../BDrawer'

// `open` is the native dialog state. `style` is the stack ticket's z-index.
const TOLERATE = { ignoreAttrs: ['open', 'style'] }

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.use(createStackPlugin())
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
  document.documentElement.classList.remove('dialog-open')
})

function example () {
  return h(BNavbar, { class: 'bg-1', expand: 'md' }, {
    default: () => h('div', { class: 'container-fluid' }, [
      h(BNavbar.Brand, { href: '#' }, () => 'Navbar'),
      h(BNavbar.Collapse, () => [
        h(BDrawer.Header, () => [
          h(BDrawer.Title, () => 'Menu'),
          h(BDrawer.Close),
        ]),
        h(BDrawer.Body, { class: 'mb-2 md:mb-0' }, () => h(BNavbar.Nav, { class: 'nav me-auto' }, () => [
          h('li', { class: 'nav-item' }, [
            h('a', { 'class': 'nav-link active', 'aria-current': 'page', 'href': '#' }, 'Home'),
          ]),
          h('li', { class: 'nav-item' }, [
            h('a', { class: 'nav-link', href: '#' }, 'Link'),
          ]),
        ])),
      ]),
    ]),
  })
}

async function settle () {
  await nextTick()
  await nextTick()
}

describe('bNavbar', () => {
  it('should conform to the basic navbar fixture when closed', async () => {
    const host = mount(example)
    await settle()

    conform(host.querySelector('nav')!, 'navbar:basic', TOLERATE)
    const dialog = host.querySelector('dialog')!
    const toggler = host.querySelector('.navbar-toggler')!
    expect(dialog.hasAttribute('open')).toBe(false)
    expect(dialog.id).not.toBe('')
    expect(toggler.getAttribute('aria-controls')).toBe(dialog.id)
    expect(toggler.getAttribute('aria-label')).toBe('Toggle navigation')
    expect(toggler.classList.contains('btn-icon')).toBe(true)
    expect(host.innerHTML).not.toContain('data-bs-toggle')
    expect(host.innerHTML).not.toContain('data-bs-target')
  })

  it('should open the drawer from the toggler and close it from the close button', async () => {
    const open = shallowRef(false)
    const host = mount(() => h(BNavbar, {
      'class': 'bg-1',
      'expand': 'md',
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }, {
      default: () => h('div', { class: 'container-fluid' }, [
        h(BNavbar.Brand, { href: '#' }, () => 'Navbar'),
        h(BNavbar.Collapse, () => [
          h(BDrawer.Header, () => [
            h(BDrawer.Title, () => 'Menu'),
            h(BDrawer.Close),
          ]),
          h(BDrawer.Body, () => 'Body'),
        ]),
      ]),
    }))
    await settle()

    await userEvent.click(host.querySelector('.navbar-toggler')!)
    await settle()

    expect(open.value).toBe(true)
    expect(host.querySelector('dialog')!.open).toBe(true)
    expect(host.querySelector('.navbar-toggler')!.getAttribute('aria-expanded')).toBe('true')

    await userEvent.click(host.querySelector('.btn-close')!)
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('dialog')!.open).toBe(false)
  })
})
