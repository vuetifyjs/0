import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createStackPlugin } from '@vuetify/v0'

// Components
import { BDrawer } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { BDrawerPlacement } from './BDrawer.vue'
import type { ShallowRef } from 'vue'

import { conform } from '../../../harness/conform'
import { BDrawerBody } from '../BDrawerBody'
import { BDrawerClose } from '../BDrawerClose'
import { BDrawerFooter } from '../BDrawerFooter'
import { BDrawerHeader } from '../BDrawerHeader'
import { BDrawerTitle } from '../BDrawerTitle'

const BODY = 'Content for the drawer goes here. You can place just about any Bootstrap component or custom elements here.'

// `open` is the native showModal state, absent from the docs' closed markup.
// `style` is the stack ticket's z-index. Native dialogs ignore it.
const TOLERATE = { ignoreAttrs: ['open', 'style'] }

const teardowns: (() => void)[] = []

function mount (node: () => any): HTMLElement {
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

function example (placement: BDrawerPlacement = 'start', sheet = false) {
  const title = sheet ? 'Sheet drawer' : 'Drawer'
  const body = sheet
    ? 'Content for the sheet drawer goes here. It sits flush to the edge with no inset, border, rounded corners, or shadow.'
    : BODY
  return () => h(BDrawer, { modelValue: true, placement, sheet }, () => [
    h(BDrawerHeader, null, () => [
      h(BDrawerTitle, null, () => title),
      h(BDrawerClose),
    ]),
    h(BDrawerBody, null, () => body),
  ])
}

function footer () {
  return () => h(BDrawer, { modelValue: true, placement: 'start' }, () => [
    h(BDrawerHeader, null, () => [
      h(BDrawerTitle, null, () => 'Drawer with footer'),
      h(BDrawerClose),
    ]),
    h(BDrawerBody, null, () => h('p', 'Content for the drawer goes here. The footer will stick to the bottom.')),
    h(BDrawerFooter, null, () => [
      h('button', { class: 'btn-solid theme-secondary', type: 'button' }, 'Close'),
      h('button', { class: 'btn-solid theme-primary', type: 'button' }, 'Save changes'),
    ]),
  ])
}

function drawer (open: ShallowRef<boolean>, blocking = false): HTMLElement {
  return mount(() => h(BDrawer, {
    blocking,
    'modelValue': open.value,
    'onUpdate:modelValue': (value: boolean) => {
      open.value = value
    },
    'placement': 'start',
  }, () => [
    h(BDrawerHeader, null, () => [
      h(BDrawerTitle, null, () => 'Drawer'),
      h(BDrawerClose),
    ]),
    h(BDrawerBody, null, () => 'Body'),
  ]))
}

async function settle () {
  await nextTick()
  await nextTick()
}

describe('bDrawer', () => {
  it('should conform to the basic drawer fixture when open', async () => {
    const host = mount(example())
    await settle()

    const element = host.querySelector('dialog')!

    conform(element, 'drawer:basic', TOLERATE)
    expect(element.open).toBe(true)
    expect(document.documentElement.classList.contains('dialog-open')).toBe(true)

    const title = element.querySelector('.drawer-title')!
    expect(element.getAttribute('aria-labelledby')).toBe(title.id)
  })

  it('should conform to the sheet drawer fixture', async () => {
    const host = mount(example('bottom', true))
    await settle()

    conform(host.querySelector('dialog')!, 'drawer:sheet', TOLERATE)
  })

  it('should conform to the footer drawer fixture', async () => {
    const host = mount(footer())
    await settle()

    conform(host.querySelector('dialog')!, 'drawer:footer', TOLERATE)
  })

  it('should add a placement class only when placement is set', async () => {
    const bare = mount(() => h(BDrawer, { modelValue: true }))
    await settle()
    expect(bare.querySelector('dialog')!.className).toBe('drawer')

    const placements = ['end', 'top', 'bottom', 'fullscreen'] as const
    for (const placement of placements) {
      const host = mount(() => h(BDrawer, { modelValue: true, placement }))
      await settle()
      expect(host.querySelector('dialog')!.classList.contains(`drawer-${placement}`)).toBe(true)
    }
  })

  it('should close on Escape', async () => {
    const open = shallowRef(true)
    const host = drawer(open)
    await settle()

    host.querySelector('dialog')!.focus()
    await userEvent.keyboard('{Escape}')
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('dialog')!.open).toBe(false)
    expect(document.documentElement.classList.contains('dialog-open')).toBe(false)
  })

  it('should close when the backdrop is clicked', async () => {
    const open = shallowRef(true)
    const host = drawer(open)
    await settle()

    const element = host.querySelector('dialog')!
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await settle()

    expect(open.value).toBe(false)
    expect(element.open).toBe(false)
  })

  it('should ignore backdrop clicks when blocking', async () => {
    const open = shallowRef(true)
    const host = drawer(open, true)
    await settle()

    const element = host.querySelector('dialog')!
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await settle()

    expect(open.value).toBe(true)
    expect(element.open).toBe(true)
    expect(element.classList.contains('drawer-static')).toBe(true)
  })

  it('should keep dialog-open while another modal dialog is open', async () => {
    const open = shallowRef(true)
    const host = drawer(open)
    const other = document.createElement('dialog')
    document.body.append(other)
    other.showModal()
    await settle()

    host.querySelector<HTMLButtonElement>('.btn-close')!.click()
    await settle()

    expect(open.value).toBe(false)
    expect(document.documentElement.classList.contains('dialog-open')).toBe(true)
    other.close()
    other.remove()
  })

  it('should close from BDrawerClose', async () => {
    const open = shallowRef(true)
    const host = drawer(open)
    await settle()

    host.querySelector<HTMLButtonElement>('.btn-close')!.click()
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('dialog')!.open).toBe(false)
  })

  it('should return focus to the trigger on close', async () => {
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()

    const open = shallowRef(false)
    const host = drawer(open)

    open.value = true
    await settle()

    expect(host.querySelector('dialog')!.contains(document.activeElement)).toBe(true)

    open.value = false
    await settle()

    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })

  it('should warn when BDrawerClose renders outside BDrawer', () => {
    using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mount(() => h(BDrawerClose))

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('BDrawerClose'), expect.anything(), expect.anything())
  })
})
