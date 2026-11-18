import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BTooltip } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { BTooltipSlotProps } from './BTooltip.vue'
import type { ShallowRef, VNode } from 'vue'

import { conform } from '../../../harness/conform'

// Inline positioning comes from usePopover.
const TOLERATE = { ignoreAttrs: ['style'] }

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  // Toast's last click leaves the pointer at the bottom-left. A mount under
  // that pointer fires mouseenter and would open a tooltip that should stay
  // closed. Park every host in the opposite corner.
  host.style.position = 'fixed'
  host.style.top = '0'
  host.style.right = '0'
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

function button (props: BTooltipSlotProps) {
  return h('button', {
    ...props.attrs,
    type: 'button',
    class: 'btn-solid theme-primary',
  }, 'Tooltip on top')
}

function example (open = true, extra: Record<string, unknown> = {}) {
  return () => h(BTooltip, {
    modelValue: open,
    text: 'Tooltip on top',
    ...extra,
  }, {
    default: button,
  })
}

function tip (open: ShallowRef<boolean>, extra: Record<string, unknown> = {}): HTMLElement {
  return mount(() => h(BTooltip, {
    ...extra,
    'text': 'Tooltip on top',
    'modelValue': open.value,
    'onUpdate:modelValue': (value: boolean) => {
      open.value = value
    },
  }, {
    default: button,
  }))
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

function enter (host: HTMLElement) {
  host.querySelector('.d-inline-block')!.dispatchEvent(new MouseEvent('mouseenter'))
}

function leave (host: HTMLElement, related: EventTarget) {
  host.querySelector('.d-inline-block')!.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: related }))
}

describe('bTooltip', () => {
  it('should conform to the basic tooltip fixture when open', async () => {
    const host = mount(example(true))
    await settle()

    const element = host.querySelector<HTMLElement>('.tooltip')!
    const control = host.querySelector<HTMLButtonElement>('button')!

    conform(element, 'tooltip:basic', TOLERATE)
    expect(element.classList.contains('show')).toBe(true)
    expect(Object.hasOwn(element.dataset, 'bsToggle')).toBe(false)
    expect(control.getAttribute('aria-describedby')).toBe(element.id)
  })

  it('should conform to the closed tooltip fixture', async () => {
    const host = mount(example(false))
    await settle()

    const element = host.querySelector<HTMLElement>('.tooltip')!
    const control = host.querySelector<HTMLButtonElement>('button')!

    conform(element, 'tooltip:closed', TOLERATE)
    expect(element.classList.contains('show')).toBe(false)
    expect(control.hasAttribute('aria-describedby')).toBe(false)
    expect(Object.hasOwn(control.dataset, 'bsToggle')).toBe(false)
  })

  it('should add tooltip-instant when instant is set', async () => {
    const host = mount(example(true, { instant: true }))
    await settle()

    expect(host.querySelector('.tooltip')!.classList.contains('tooltip-instant')).toBe(true)
  })

  it('should point the arrow at the trigger', async () => {
    const host = mount(example(true))
    await new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    })

    const arrow = host.querySelector<HTMLElement>('.tooltip-arrow')!
    const anchor = host.querySelector('.d-inline-block')!.getBoundingClientRect()
    const box = arrow.getBoundingClientRect()
    const delta = Math.abs((box.left + box.width / 2) - (anchor.left + anchor.width / 2))

    expect(arrow.style.position).toBe('absolute')
    expect(delta).toBeLessThan(1)
  })

  it('should write data-bs-placement from placement', async () => {
    const host = mount(example(true, { placement: 'right' }))
    await settle()

    expect(host.querySelector<HTMLElement>('.tooltip')!.dataset.bsPlacement).toBe('right')
  })

  it('should open on hover and close when the pointer leaves', async () => {
    const open = shallowRef(false)
    const host = tip(open)
    await settle()

    enter(host)
    await settle()

    expect(open.value).toBe(true)
    expect(host.querySelector('.tooltip')!.classList.contains('show')).toBe(true)

    leave(host, document.body)
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('.tooltip')!.classList.contains('show')).toBe(false)
  })

  it('should stay open while the pointer is on the tip', async () => {
    const open = shallowRef(false)
    const host = tip(open)
    await settle()

    const element = host.querySelector('.tooltip')!

    enter(host)
    await settle()

    leave(host, element)
    await settle()

    expect(open.value).toBe(true)

    element.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }))
    await settle()

    expect(open.value).toBe(false)
  })

  it('should close on Escape', async () => {
    const open = shallowRef(true)
    const host = tip(open)
    await settle()

    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    }))
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('.tooltip')!.classList.contains('show')).toBe(false)
  })

  it('should open on focus and close when focus leaves', async () => {
    const open = shallowRef(false)
    const host = tip(open)
    await settle()

    const control = host.querySelector('button')!

    control.focus()
    await settle()

    expect(open.value).toBe(true)

    control.blur()
    await settle()

    expect(open.value).toBe(false)
  })

  it('should not open when the title is empty', async () => {
    const open = shallowRef(false)
    const host = mount(() => h(BTooltip, {
      'text': '   ',
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }, {
      default: button,
    }))
    await settle()

    enter(host)
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('.tooltip')!.classList.contains('show')).toBe(false)
  })

  it('should toggle from a click when trigger is click', async () => {
    const open = shallowRef(false)
    const host = tip(open, { trigger: 'click' })
    await settle()

    enter(host)
    await settle()

    expect(open.value).toBe(false)

    host.querySelector('.d-inline-block')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await settle()

    expect(open.value).toBe(true)

    host.querySelector('.d-inline-block')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await settle()

    expect(open.value).toBe(false)
  })

  it('should close a click tip that was opened from outside', async () => {
    const open = shallowRef(true)
    const host = tip(open, { trigger: 'click' })
    await settle()

    expect(open.value).toBe(true)

    host.querySelector('.d-inline-block')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await settle()

    expect(open.value).toBe(false)
  })

  it('should cancel a pending click show or hide on the second click', async () => {
    const open = shallowRef(false)
    const host = tip(open, { trigger: 'click', delay: 60 })
    await settle()

    const node = host.querySelector('.d-inline-block')!
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wait(30)

    expect(open.value).toBe(false)

    node.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wait(120)

    expect(open.value).toBe(false)

    node.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wait(120)

    expect(open.value).toBe(true)

    node.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wait(30)

    expect(open.value).toBe(true)

    node.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wait(120)

    expect(open.value).toBe(true)
  })

  it('should wait out the delay before showing and hiding', async () => {
    const open = shallowRef(false)
    const host = tip(open, { delay: 60 })
    await settle()

    enter(host)
    await wait(30)

    expect(open.value).toBe(false)

    await wait(120)

    expect(open.value).toBe(true)

    leave(host, document.body)
    await wait(30)

    expect(open.value).toBe(true)

    await wait(120)

    expect(open.value).toBe(false)
  })
})
