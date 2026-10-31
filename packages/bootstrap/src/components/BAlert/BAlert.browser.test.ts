import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BAlert } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { ShallowRef, VNode } from 'vue'

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

function wait (ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function alert (open: ShallowRef<boolean>, props: Record<string, unknown> = {}, onDismiss?: () => void) {
  return mount(() => h(BAlert, {
    ...props,
    'modelValue': open.value,
    'onUpdate:modelValue': (value: boolean) => {
      open.value = value
    },
    'onAfterLeave': onDismiss,
  }, () => h('p', 'A simple alert—check it out!')))
}

describe('bAlert', () => {
  it('should conform to the basic alert fixture', async () => {
    const host = alert(shallowRef(true))
    await settle()

    const element = host.querySelector<HTMLElement>('.alert')!

    conform(element, 'alert:basic')
    expect(Object.hasOwn(element.dataset, 'bsDismiss')).toBe(false)
  })

  it('should add a theme class', async () => {
    const host = alert(shallowRef(true), { theme: 'success' })
    await settle()

    expect(host.querySelector('.alert')!.classList.contains('theme-success')).toBe(true)
  })

  it('should fade with hiding and then unmount', async () => {
    const open = shallowRef(true)
    const dismissed = shallowRef(false)
    const host = alert(open, {}, () => {
      dismissed.value = true
    })
    await settle()

    open.value = false
    await settle()

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      expect(host.querySelector('.alert')).toBeNull()
      expect(dismissed.value).toBe(true)
      return
    }

    const element = host.querySelector('.alert')!

    expect(element.classList.contains('hiding')).toBe(true)
    expect(dismissed.value).toBe(false)
    await wait(220)
    expect(host.querySelector('.alert')).toBeNull()
    expect(open.value).toBe(false)
    expect(dismissed.value).toBe(true)
  })

  it('should unmount immediately when instant is set', async () => {
    const open = shallowRef(true)
    const host = alert(open, { instant: true })
    await settle()

    expect(host.querySelector('.alert')!.classList.contains('alert-instant')).toBe(true)

    open.value = false
    await settle()

    expect(host.querySelector('.alert')).toBeNull()
  })

  it('should render nothing when the model starts closed', async () => {
    const host = alert(shallowRef(false))
    await settle()

    expect(host.querySelector('.alert')).toBeNull()
  })
})
