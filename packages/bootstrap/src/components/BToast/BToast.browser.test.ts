import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BToast } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { BToastPushOptions } from '../BToastQueue/BToastQueue.vue'
import type { ShallowRef } from 'vue'

import { conform } from '../../../harness/conform'

const teardowns: (() => void)[] = []

function mount (node: () => any, away = false): HTMLElement {
  const host = document.createElement('div')
  // A click in an earlier test leaves the pointer on the toast. mouseenter
  // pauses autohide, so the delay test sits in the opposite corner.
  host.style.position = 'fixed'
  if (away) {
    host.style.top = '0'
    host.style.right = '0'
  } else {
    host.style.bottom = '0'
    host.style.left = '0'
  }
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

function contents () {
  return [
    h('div', { class: 'toast-header' }, [
      h('strong', { class: 'me-auto' }, 'Bootstrap'),
      h('small', '11 mins ago'),
      h(BToast.Close),
    ]),
    h(BToast.Body, () => 'Hello, world! This is a toast message.'),
  ]
}

function example (open = true, extra: Record<string, unknown> = {}) {
  return () => h(BToast, { modelValue: open, ...extra }, () => contents())
}

function toast (open: ShallowRef<boolean>, extra: Record<string, unknown> = {}, away = false): HTMLElement {
  return mount(() => h(BToast, {
    ...extra,
    'modelValue': open.value,
    'onUpdate:modelValue': (value: boolean) => {
      open.value = value
    },
  }, () => contents()), away)
}

async function settle () {
  await nextTick()
  await nextTick()
}

function wait (ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

describe('bToast', () => {
  it('should conform to the basic toast fixture when open', async () => {
    const host = mount(example(true, { autohide: false }))
    await settle()

    const element = host.querySelector('.toast')!

    conform(element, 'toast:basic')
    expect(element.classList.contains('show')).toBe(true)
    expect(Object.hasOwn((element.querySelector('button')!).dataset, 'bsDismiss')).toBe(false)
  })

  it('should conform to the closed toast fixture', async () => {
    const host = mount(example(false))
    await settle()

    const element = host.querySelector('.toast')!

    conform(element, 'toast:closed')
    expect(element.classList.contains('show')).toBe(false)
  })

  it('should add toast-instant when instant is set', async () => {
    const host = mount(example(true, { autohide: false, instant: true }))
    await settle()

    expect(host.querySelector('.toast')!.classList.contains('toast-instant')).toBe(true)
  })

  it('should close from the close button', async () => {
    const open = shallowRef(true)
    const host = toast(open, { autohide: false })
    await settle()

    await userEvent.click(host.querySelector('.btn-close')!)
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('.toast')!.classList.contains('show')).toBe(false)
  })

  it('should hide itself after the delay', async () => {
    const open = shallowRef(true)
    const host = toast(open, { delay: 50 }, true)
    await settle()

    await wait(120)

    expect(open.value).toBe(false)
    expect(host.querySelector('.toast')!.classList.contains('show')).toBe(false)
  })

  it('should restart the delay when the pointer leaves', async () => {
    const open = shallowRef(true)
    const host = toast(open, { delay: 80 })
    await settle()

    host.querySelector('.toast')!.dispatchEvent(new MouseEvent('mouseenter'))
    await wait(120)

    expect(open.value).toBe(true)

    host.querySelector('.toast')!.dispatchEvent(new MouseEvent('mouseleave'))
    await wait(40)

    expect(open.value).toBe(true)

    await wait(80)

    expect(open.value).toBe(false)
  })

  it('should stack pushed toasts and remove one when it closes', async () => {
    let push: ((message: string, options?: BToastPushOptions) => string) | undefined
    const host = mount(() => h(BToast.Queue, {
      autohide: false,
      ref: (value: unknown) => {
        const exposed = value as { push?: typeof push } | null
        push = exposed?.push
      },
    }))
    await settle()

    push!('First')
    push!('Second')
    await settle()

    const items = host.querySelectorAll('.toast')

    expect(items.length).toBe(2)
    expect(items[0].classList.contains('show')).toBe(true)
    expect(items[1].classList.contains('show')).toBe(true)
    expect(host.textContent).toContain('First')
    expect(host.textContent).toContain('Second')

    await userEvent.click(items[0].querySelector('.btn-close')!)
    await settle()

    expect(items[0].classList.contains('show')).toBe(false)
    expect(host.querySelectorAll('.toast').length).toBe(2)

    await wait(400)

    expect(host.querySelectorAll('.toast').length).toBe(1)
    expect(host.textContent).toContain('Second')
  })

  it('should warn when BToastClose renders outside BToast', () => {
    using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mount(() => h(BToast.Close))

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('BToastClose'), expect.anything(), expect.anything())
  })
})
