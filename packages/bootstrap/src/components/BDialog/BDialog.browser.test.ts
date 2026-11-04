import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createStackPlugin } from '@vuetify/v0'

// Components
import { BDialog } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { ShallowRef } from 'vue'

import { conform } from '../../../harness/conform'
import { BDialogBody } from '../BDialogBody'
import { BDialogClose } from '../BDialogClose'
import { BDialogFooter } from '../BDialogFooter'
import { BDialogHeader } from '../BDialogHeader'
import { BDialogTitle } from '../BDialogTitle'

const BODY = 'This is a native dialog element. It uses the browser’s built-in modal behavior for accessibility and focus management.'

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

function example (size?: 'sm' | 'lg' | 'xl') {
  return () => h(BDialog, { modelValue: true, size }, () => [
    h(BDialogHeader, null, () => [
      h(BDialogTitle, null, () => 'Dialog title'),
      h(BDialogClose),
    ]),
    h(BDialogBody, null, () => h('p', BODY)),
    h(BDialogFooter, null, () => [
      h('button', { class: 'btn-solid theme-secondary', type: 'button' }, 'Close'),
      h('button', { class: 'btn-solid theme-primary', type: 'button' }, 'Save changes'),
    ]),
  ])
}

function dialog (open: ShallowRef<boolean>, blocking = false): HTMLElement {
  return mount(() => h(BDialog, {
    blocking,
    'modelValue': open.value,
    'onUpdate:modelValue': (value: boolean) => {
      open.value = value
    },
  }, () => [
    h(BDialogHeader, null, () => [
      h(BDialogTitle, null, () => 'Dialog title'),
      h(BDialogClose),
    ]),
    h(BDialogBody, null, () => 'Body'),
  ]))
}

async function settle () {
  await nextTick()
  await nextTick()
}

describe('bDialog', () => {
  it('should conform to the basic dialog fixture when open', async () => {
    const host = mount(example())
    await settle()

    const element = host.querySelector('dialog')!

    conform(element, 'dialog:basic', TOLERATE)
    expect(element.open).toBe(true)
    expect(document.documentElement.classList.contains('dialog-open')).toBe(true)

    const title = element.querySelector('.dialog-title')!
    expect(element.getAttribute('aria-labelledby')).toBe(title.id)
  })

  it('should conform to the small dialog fixture', async () => {
    const host = mount(example('sm'))
    await settle()

    conform(host.querySelector('dialog')!, 'dialog:small', TOLERATE)
  })

  it('should add the large and extra-large size classes', async () => {
    const large = mount(() => h(BDialog, { modelValue: true, size: 'lg' }))
    await settle()
    expect(large.querySelector('dialog')!.classList.contains('dialog-lg')).toBe(true)

    const xl = mount(() => h(BDialog, { modelValue: true, size: 'xl' }))
    await settle()
    expect(xl.querySelector('dialog')!.classList.contains('dialog-xl')).toBe(true)
  })

  it('should bounce and stay open when keyboard is false', async () => {
    const open = shallowRef(true)
    const host = mount(() => h(BDialog, {
      'keyboard': false,
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }))
    await settle()

    const element = host.querySelector('dialog')!
    element.dispatchEvent(new Event('cancel', { cancelable: true }))
    await settle()

    expect(open.value).toBe(true)
    expect(element.open).toBe(true)
    expect(element.classList.contains('dialog-static')).toBe(true)
  })

  it('should open non-modal without locking scroll', async () => {
    const open = shallowRef(true)
    const host = mount(() => h(BDialog, {
      'modal': false,
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }))
    await settle()

    const element = host.querySelector('dialog')!
    expect(element.open).toBe(true)
    expect(element.matches(':modal')).toBe(false)
    expect(element.classList.contains('dialog-nonmodal')).toBe(true)
    expect(element.getAttribute('aria-modal')).toBeNull()
    expect(document.documentElement.classList.contains('dialog-open')).toBe(false)

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle()
    expect(open.value).toBe(false)
  })

  it('should close on Escape', async () => {
    const open = shallowRef(true)
    const host = dialog(open)
    await settle()

    host.querySelector('dialog')!.focus()
    await userEvent.keyboard('{Escape}')
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('dialog')!.open).toBe(false)
  })

  it('should close when the backdrop is clicked', async () => {
    const open = shallowRef(true)
    const host = dialog(open)
    await settle()

    const element = host.querySelector('dialog')!
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await settle()

    expect(open.value).toBe(false)
    expect(element.open).toBe(false)
  })

  it('should ignore backdrop clicks when blocking', async () => {
    const open = shallowRef(true)
    const host = dialog(open, true)
    await settle()

    const element = host.querySelector('dialog')!
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await settle()

    expect(open.value).toBe(true)
    expect(element.open).toBe(true)
  })

  it('should close from BDialogClose', async () => {
    const open = shallowRef(true)
    const host = dialog(open)
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
    const host = dialog(open)

    open.value = true
    await settle()

    expect(host.querySelector('dialog')!.contains(document.activeElement)).toBe(true)

    open.value = false
    await settle()

    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })

  it('should warn when BDialogClose renders outside BDialog', () => {
    using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mount(() => h(BDialogClose))

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('BDialogClose'), expect.anything(), expect.anything())
  })
})
