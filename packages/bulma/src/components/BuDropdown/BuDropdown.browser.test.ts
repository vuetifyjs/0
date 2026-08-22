import { describe, expect, it } from 'vitest'

import { BuDropdown } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { BuDropdownMenuSlotProps } from '../BuDropdownMenu'
import type { BuDropdownTriggerSlotProps } from '../BuDropdownTrigger'

import { conform } from '../../../harness/conform'
// Components
import { BuDropdownMenu } from '../BuDropdownMenu'
import { BuDropdownTrigger } from '../BuDropdownTrigger'

function button (props: BuDropdownTriggerSlotProps) {
  return h('button', { class: 'button', ...props.attrs }, [
    h('span', 'Dropdown button'),
    h('span', { class: 'icon is-small' }, [
      h('i', { 'class': 'fas fa-angle-down', 'aria-hidden': 'true' }),
    ]),
  ])
}

function items (props: BuDropdownMenuSlotProps) {
  return [
    h('a', { class: 'dropdown-item', href: '#', ...props.item }, ' Dropdown item '),
    h('a', { class: 'dropdown-item', ...props.item }, ' Other dropdown item '),
    h('a', { class: 'dropdown-item is-active', href: '#', ...props.item }, ' Active dropdown item '),
    h('a', { class: 'dropdown-item', href: '#', ...props.item }, ' Other dropdown item '),
    h('hr', { class: 'dropdown-divider' }),
    h('a', { class: 'dropdown-item', href: '#', ...props.item }, ' With a divider '),
  ]
}

function parts () {
  return [
    h(BuDropdownTrigger, null, { default: button }),
    h(BuDropdownMenu, null, { default: items }),
  ]
}

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

function click (target: Element | Document) {
  const node = target === document ? document.body : target
  node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
  node.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
}

describe('buDropdown', () => {
  it('conforms to the dropdown fixture when open', () => {
    const { el, unmount } = mount({
      render: () => h(BuDropdown, { modelValue: true, menu: true }, parts),
    })
    // id / aria-controls: fixture hardcodes "dropdown-menu", ours is a useId value.
    conform(el, 'dropdown', { ignoreAttrs: ['id', 'aria-controls'] })
    expect(el.querySelector('.dropdown-trigger button')!.getAttribute('aria-controls'))
      .toBe(el.querySelector('.dropdown-menu')!.id)
    unmount()
  })

  it('omits role="menu" in arbitrary-content mode', () => {
    const { el, unmount } = mount({
      render: () => h(BuDropdown, { modelValue: true }, parts),
    })
    expect(el.querySelector('.dropdown-menu')!.hasAttribute('role')).toBe(false)
    unmount()
  })

  it('closes on outside click and on Escape', async () => {
    const open = shallowRef(true)
    const { el, unmount } = mount({
      setup () {
        return () => h(BuDropdown, {
          'modelValue': open.value,
          'onUpdate:modelValue': (value: boolean) => {
            open.value = value
          },
        }, parts)
      },
    })

    // Inside click does not close.
    click(el.querySelector('.dropdown-content a')!)
    await nextTick()
    expect(open.value).toBe(true)

    click(document)
    await nextTick()
    expect(open.value).toBe(false)
    expect(el.classList.contains('is-active')).toBe(false)

    open.value = true
    await nextTick()
    el.querySelector('.dropdown-content a')!.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await nextTick()
    expect(open.value).toBe(false)

    unmount()
  })

  it('toggles via the trigger and reflects is-active', async () => {
    const open = shallowRef(false)
    const { el, unmount } = mount({
      setup () {
        return () => h(BuDropdown, {
          'modelValue': open.value,
          'onUpdate:modelValue': (value: boolean) => {
            open.value = value
          },
        }, parts)
      },
    })

    expect(el.classList.contains('is-active')).toBe(false)
    ;(el.querySelector('.dropdown-trigger button') as HTMLButtonElement).click()
    await nextTick()
    expect(open.value).toBe(true)
    expect(el.classList.contains('is-active')).toBe(true)

    unmount()
  })
})
