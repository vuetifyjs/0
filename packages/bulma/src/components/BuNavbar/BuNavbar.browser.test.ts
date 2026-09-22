import { describe, expect, it } from 'vitest'

// Components
import { BuNavbar } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

import { conform } from '../../../harness/conform'
import { BuNavbarBrand } from '../BuNavbarBrand'
import { BuNavbarMenu } from '../BuNavbarMenu'

function mount (component: Parameters<typeof createApp>[0]) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(component)
  app.mount(host)
  const el = host.firstElementChild!
  function unmount () {
    app.unmount()
    host.remove()
  }
  return { el, unmount }
}

function menu () {
  return [
    h('div', { class: 'navbar-start' }, [
      h('a', { class: 'navbar-item' }, 'Home'),
      h('a', { class: 'navbar-item' }, 'Documentation'),
      h('div', { class: 'navbar-item has-dropdown is-hoverable' }, [
        h('a', { class: 'navbar-link' }, 'More'),
        h('div', { class: 'navbar-dropdown' }, [
          h('a', { class: 'navbar-item' }, 'About'),
          h('a', { class: 'navbar-item is-selected' }, 'Jobs'),
          h('a', { class: 'navbar-item' }, 'Contact'),
          h('hr', { class: 'navbar-divider' }),
          h('a', { class: 'navbar-item' }, 'Report an issue'),
        ]),
      ]),
    ]),
    h('div', { class: 'navbar-end' }, [
      h('div', { class: 'navbar-item' }, [
        h('div', { class: 'buttons' }, [
          h('a', { class: 'button is-primary' }, [h('strong', 'Sign up')]),
          h('a', { class: 'button is-light' }, 'Log in'),
        ]),
      ]),
    ]),
  ]
}

describe('buNavbar', () => {
  it('should conform to the full navbar fixture', async () => {
    const { el, unmount } = mount({
      render: () => h(BuNavbar, { id: 'navbarBasicExample' }, () => [
        h(BuNavbarBrand, null, () => h('a', { class: 'navbar-item', href: 'https://bulma.io' }, [
          h('img', { src: 'logo.png', alt: 'Logo' }),
        ])),
        h(BuNavbarMenu, null, menu),
      ]),
    })

    await nextTick()

    conform(el, 'navbar')

    unmount()
  })

  it('should toggle is-active on both burger and menu and conform to the open fixture', async () => {
    const { el, unmount } = mount({
      render: () => h(BuNavbar, { id: 'navbarOpenExample' }, () => [
        h(BuNavbarBrand),
        h(BuNavbarMenu, null, () => h('div', { class: 'navbar-start' }, [
          h('a', { class: 'navbar-item' }, 'Home'),
        ])),
      ]),
    })

    await nextTick()

    const burger = el.querySelector<HTMLElement>('.navbar-burger')!
    const target = el.querySelector<HTMLElement>('.navbar-menu')!

    expect(burger.getAttribute('aria-expanded')).toBe('false')
    expect(target.classList.contains('is-active')).toBe(false)

    burger.click()
    await nextTick()

    conform(el, 'navbar:OPEN')

    burger.click()
    await nextTick()

    expect(burger.getAttribute('aria-expanded')).toBe('false')
    expect(burger.classList.contains('is-active')).toBe(false)
    expect(target.classList.contains('is-active')).toBe(false)

    unmount()
  })
})
