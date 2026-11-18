import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BMenu } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { BMenuAutoClose, BMenuPlacement } from './BMenu.vue'
import type { ShallowRef } from 'vue'

import { conform } from '../../../harness/conform'
import { BMenuDivider } from '../BMenuDivider'
import { BMenuHeader } from '../BMenuHeader'
import { BMenuItem } from '../BMenuItem'
import { BMenuSubmenu } from '../BMenuSubmenu'

// Inline positioning comes from usePopover. `open` is not a menu attribute.
const TOLERATE = { ignoreAttrs: ['style'] }

const teardowns: (() => void)[] = []

function mount (node: () => any): HTMLElement {
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

function outsideButton (): HTMLButtonElement {
  const outside = document.createElement('button')
  outside.type = 'button'
  outside.textContent = 'Outside'
  outside.style.position = 'fixed'
  outside.style.top = '0'
  outside.style.right = '0'
  outside.style.zIndex = '10000'
  document.body.append(outside)
  teardowns.push(() => outside.remove())
  return outside
}

function items () {
  return [
    h(BMenuItem, { href: '#' }, () => 'Menu item 1'),
    h(BMenuItem, { href: '#' }, () => 'Menu item 2'),
    h(BMenuItem, { href: '#' }, () => 'Menu item 3'),
  ]
}

function example (open = true, placement?: BMenuPlacement) {
  return () => h(BMenu, { modelValue: open, placement }, () => items())
}

function menu (open: ShallowRef<boolean>, autoClose: BMenuAutoClose = true): HTMLElement {
  return mount(() => h(BMenu, {
    autoClose,
    'modelValue': open.value,
    'onUpdate:modelValue': (value: boolean) => {
      open.value = value
    },
  }, () => items()))
}

async function settle () {
  await nextTick()
  await nextTick()
}

describe('bMenu', () => {
  it('should conform to the basic menu fixture when open', async () => {
    const host = mount(example())
    await settle()

    const element = host.querySelector<HTMLElement>('.menu')!

    conform(element, 'menu:basic', TOLERATE)
    expect(element.classList.contains('show')).toBe(true)
    expect(element.getAttribute('popover')).toBeNull()
    expect(element.style.position).toBe('fixed')
    expect((host.querySelector('button')!).dataset.bsToggle).toBeNull()
  })

  it('should conform to the closed trigger', async () => {
    const host = mount(example(false))
    await settle()

    const button = host.querySelector('button')!
    conform(button, 'menu:trigger', TOLERATE)
    expect(host.querySelector('.menu')!.classList.contains('show')).toBe(false)
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })

  it('should conform to the header, divider, and submenu fixture', async () => {
    const host = mount(() => h(BMenu, { modelValue: true }, () => [
      h(BMenuHeader, null, () => 'Account'),
      h(BMenuItem, { href: '#' }, () => 'Profile'),
      h(BMenuDivider),
      h(BMenuItem, { href: '#' }, () => 'Sign out'),
      h(BMenuSubmenu, { label: 'File' }, () => [
        h(BMenuItem, { href: '#' }, () => 'New'),
      ]),
    ]))
    await settle()

    conform(host.querySelector('.menu')!, 'menu:parts', TOLERATE)
  })

  it('should write data-bs-placement from the placement prop', async () => {
    const host = mount(example(true, 'top-end'))
    await settle()

    expect(host.querySelector<HTMLElement>('.menu')!.dataset.bsPlacement).toBe('top-end')
  })

  it('should toggle from the trigger', async () => {
    const open = shallowRef(false)
    const host = menu(open)
    await settle()

    await userEvent.click(host.querySelector('button')!)
    await settle()

    expect(open.value).toBe(true)
    expect(host.querySelector('.menu')!.classList.contains('show')).toBe(true)
    expect(host.querySelector('button')!.getAttribute('aria-expanded')).toBe('true')
  })

  it('should close when an item is clicked', async () => {
    const open = shallowRef(true)
    const host = menu(open)
    await settle()

    await userEvent.click(host.querySelector('.menu-item')!)
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('.menu')!.classList.contains('show')).toBe(false)
  })

  it('should close on an outside click', async () => {
    const open = shallowRef(true)
    const host = menu(open)
    const outside = outsideButton()
    await settle()

    await userEvent.click(outside)
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('.menu')!.classList.contains('show')).toBe(false)
  })

  it('should ignore an outside click when autoClose is inside', async () => {
    const open = shallowRef(true)
    const host = menu(open, 'inside')
    const outside = outsideButton()
    await settle()

    await userEvent.click(outside)
    await settle()

    expect(open.value).toBe(true)

    await userEvent.click(host.querySelector('.menu-item')!)
    await settle()

    expect(open.value).toBe(false)
  })

  it('should move focus with ArrowDown and return it on Escape', async () => {
    const open = shallowRef(false)
    const host = menu(open)
    await settle()

    const trigger = host.querySelector('button')!
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}')
    await settle()

    expect(open.value).toBe(true)
    expect(document.activeElement).toBe(host.querySelector('.menu-item'))

    await userEvent.keyboard('{Escape}')
    await settle()

    expect(open.value).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })

  it('should open a submenu from its trigger', async () => {
    const host = mount(() => h(BMenu, { modelValue: true }, () => [
      h(BMenuSubmenu, { label: 'File' }, () => [
        h(BMenuItem, { href: '#' }, () => 'New'),
      ]),
    ]))
    await settle()

    const submenu = host.querySelector('.submenu')!
    await userEvent.click(submenu.querySelector('button')!)
    await settle()

    expect(submenu.classList.contains('show')).toBe(true)
    expect(submenu.querySelector('.menu')!.classList.contains('show')).toBe(true)
    expect(submenu.querySelector('button')!.getAttribute('aria-expanded')).toBe('true')
  })

  it('should warn when BMenuItem renders outside BMenu', () => {
    using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mount(() => h(BMenuItem, { href: '#' }, () => 'Orphan'))

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('BMenuItem'), expect.anything(), expect.anything())
  })
})
