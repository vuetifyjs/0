import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BPopover } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { BPopoverSlotProps } from './BPopover.vue'
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'

// Inline positioning comes from usePopover.
const TOLERATE = { ignoreAttrs: ['style'] }

const BODY = 'This is the popover content—make it as long as you want.'

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
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

function button (props: BPopoverSlotProps) {
  return h('button', {
    ...props.attrs,
    type: 'button',
    class: 'btn-solid theme-primary',
  }, 'Toggle popover')
}

function example (open = true, extra: Record<string, unknown> = {}) {
  return () => h(BPopover, {
    modelValue: open,
    title: 'Popover title',
    text: BODY,
    ...extra,
  }, {
    default: button,
  })
}

async function settle () {
  await nextTick()
  await nextTick()
}

describe('bPopover', () => {
  it('should conform to the basic popover fixture when open', async () => {
    const host = mount(example(true))
    await settle()

    const element = host.querySelector<HTMLElement>('.popover')!
    const control = host.querySelector<HTMLButtonElement>('button')!

    conform(element, 'popover:basic', TOLERATE)
    expect(element.classList.contains('show')).toBe(true)
    expect(Object.hasOwn(element.dataset, 'bsToggle')).toBe(false)
    expect(Object.hasOwn(element.dataset, 'bsTitle')).toBe(false)
    expect(Object.hasOwn(element.dataset, 'bsContent')).toBe(false)
    expect(control.getAttribute('aria-describedby')).toBe(element.id)
    expect(Object.hasOwn(control.dataset, 'bsToggle')).toBe(false)
  })

  it('should not add show when title and text are empty', async () => {
    const host = mount(() => h(BPopover, {
      modelValue: true,
      title: '',
      text: '',
    }, {
      default: () => h('button', { type: 'button' }, 'Empty'),
    }))
    await settle()

    const element = host.querySelector<HTMLElement>('.popover')!

    expect(element.classList.contains('show')).toBe(false)
    expect(element.querySelector('.popover-header')).toBeNull()
    expect(element.querySelector('.popover-body')).toBeNull()
  })

  it('should open when the content slot is set and both strings are empty', async () => {
    const host = mount(() => h(BPopover, {
      modelValue: true,
      title: '',
      text: '',
    }, {
      default: () => h('button', { type: 'button' }, 'Tip'),
      content: () => 'Markup',
    }))
    await settle()

    const element = host.querySelector<HTMLElement>('.popover')!

    expect(element.classList.contains('show')).toBe(true)
    expect(element.querySelector('.popover-header')).toBeNull()
    expect(element.querySelector('.popover-body')!.textContent).toContain('Markup')
  })

  it('should toggle on click', async () => {
    const open = shallowRef(false)
    const host = mount(() => h(BPopover, {
      'title': 'Popover title',
      'text': BODY,
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }, {
      default: button,
    }))
    await settle()

    expect(host.querySelector('.popover')!.classList.contains('show')).toBe(false)

    host.querySelector('button')!.click()
    await settle()

    expect(open.value).toBe(true)
    expect(host.querySelector('.popover')!.classList.contains('show')).toBe(true)

    host.querySelector('button')!.click()
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('.popover')!.classList.contains('show')).toBe(false)
  })

  it('should close on escape', async () => {
    const open = shallowRef(true)
    const host = mount(() => h(BPopover, {
      'title': 'Popover title',
      'text': BODY,
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }, {
      default: button,
    }))
    await settle()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await settle()

    expect(open.value).toBe(false)
    expect(host.querySelector('.popover')!.classList.contains('show')).toBe(false)
  })

  it('should add popover-instant when instant is set', async () => {
    const host = mount(example(true, { instant: true }))
    await settle()

    expect(host.querySelector('.popover')!.classList.contains('popover-instant')).toBe(true)
  })
})
