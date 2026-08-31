import { afterEach, describe, expect, it } from 'vitest'

// Framework
import { createStackPlugin } from '@vuetify/v0'

import { BuModal } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { ShallowRef } from 'vue'

import { conform } from '../../../harness/conform'
// Components
import { BuModalBody } from '../BuModalBody'
import { BuModalCard } from '../BuModalCard'
import { BuModalClose } from '../BuModalClose'
import { BuModalContent } from '../BuModalContent'
import { BuModalDelete } from '../BuModalDelete'
import { BuModalFoot } from '../BuModalFoot'
import { BuModalHead } from '../BuModalHead'
import { BuModalTitle } from '../BuModalTitle'

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
})

function card () {
  return () => h(BuModalCard, null, () => [
    h(BuModalHead, null, () => [
      h(BuModalTitle, null, () => 'Modal title'),
      h(BuModalDelete),
    ]),
    h(BuModalBody),
    h(BuModalFoot, null, () => h('div', { class: 'buttons' }, [
      h('button', { class: 'button is-success' }, 'Save changes'),
      h('button', { class: 'button' }, 'Cancel'),
    ])),
  ])
}

function content () {
  return () => [h(BuModalContent), h(BuModalClose)]
}

function modal (open: ShallowRef<boolean>, children: () => any): HTMLElement {
  return mount(() => h(BuModal, {
    'modelValue': open.value,
    'onUpdate:modelValue': (value: boolean) => {
      open.value = value
    },
  }, children))
}

async function settle () {
  await nextTick()
  await nextTick()
}

// aria-label text is localized by v0; `style` carries the stack ticket's
// z-index; Dialog.Close correctly emits type="button" the fixture omits.
const TOLERATE = { ignoreAttrs: ['aria-label', 'style', 'type'] }

describe('buModal', () => {
  it('should conform to the modal-content fixture when open', () => {
    const host = mount(() => h(BuModal, { modelValue: true }, content()))

    conform(host.firstElementChild!, 'modal', TOLERATE)
  })

  it('should conform to the modal-card fixture when open', () => {
    const host = mount(() => h(BuModal, { modelValue: true }, card()))

    conform(host.firstElementChild!, 'modal:card', TOLERATE)

    const panel = host.querySelector('.modal-card')!
    const title = host.querySelector('.modal-card-title')!

    expect(panel.getAttribute('aria-labelledby')).toBe(title.id)
  })

  it('should close on Escape from within the modal', async () => {
    const open = shallowRef(true)
    modal(open, card())
    await settle()

    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await nextTick()

    expect(open.value).toBe(false)
  })

  it('should focus the first focusable on open and restore focus on close', async () => {
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()

    const open = shallowRef(false)
    const host = modal(open, card())

    open.value = true
    await settle()

    expect(document.activeElement).toBe(host.querySelector('.delete'))

    open.value = false
    await settle()

    expect(document.activeElement).toBe(outside)

    outside.remove()
  })

  it('should wrap Tab and Shift+Tab within the modal subtree', async () => {
    const open = shallowRef(true)
    const host = modal(open, card())
    await settle()

    const first = host.querySelector<HTMLButtonElement>('.delete')!
    const last = [...host.querySelectorAll<HTMLButtonElement>('.buttons .button')].at(-1)!

    last.focus()
    last.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }))

    expect(document.activeElement).toBe(first)

    first.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab', shiftKey: true }))

    expect(document.activeElement).toBe(last)
  })

  it('should fall back to the panel when the modal holds nothing focusable', async () => {
    const open = shallowRef(true)
    const host = modal(open, () => h(BuModalContent, null, () => 'No focusable content'))
    await settle()

    expect(document.activeElement).toBe(host.querySelector('.modal-content'))
  })

  it('should close on background click unless blocking', async () => {
    const open = shallowRef(true)
    const host = modal(open, content())
    await settle()

    host.querySelector<HTMLElement>('.modal-background')!.click()
    await nextTick()

    expect(open.value).toBe(false)

    const held = shallowRef(true)
    const kept = mount(() => h(BuModal, {
      'blocking': true,
      'modelValue': held.value,
      'onUpdate:modelValue': (value: boolean) => {
        held.value = value
      },
    }, content()))
    await settle()

    kept.querySelector<HTMLElement>('.modal-background')!.click()
    await nextTick()

    expect(held.value).toBe(true)
  })
})
