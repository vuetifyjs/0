import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BCollapse } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'

const PANEL = 'Some placeholder content for the collapse component.'

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

describe('bCollapse', () => {
  it('should conform to the basic collapse fixture when open', async () => {
    const host = mount(() => h(BCollapse, { modelValue: true }, () => PANEL))
    await settle()

    const element = host.querySelector<HTMLElement>('.collapse')!

    conform(element, 'collapse:basic')
    expect(element.classList.contains('show')).toBe(true)
    expect(element.id).not.toBe('')
    expect(Object.hasOwn(element.dataset, 'bsToggle')).toBe(false)
  })

  it('should not add show when the model is closed', async () => {
    const open = shallowRef(false)
    const host = mount(() => h(BCollapse, {
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }, () => PANEL))
    await settle()

    expect(host.querySelector('.collapse')!.classList.contains('show')).toBe(false)
    expect(host.querySelector('.collapse')!.classList.contains('collapsing')).toBe(false)
  })

  it('should add collapse-horizontal when horizontal is set', async () => {
    const host = mount(() => h(BCollapse, { modelValue: true, horizontal: true }, () => PANEL))
    await settle()

    const element = host.querySelector('.collapse')!

    expect(element.classList.contains('collapse-horizontal')).toBe(true)
    expect(element.classList.contains('show')).toBe(true)
  })

  it('should use the id prop when one is passed', async () => {
    const host = mount(() => h(BCollapse, { modelValue: true, id: 'collapse-example' }, () => PANEL))
    await settle()

    expect(host.querySelector('.collapse')!.id).toBe('collapse-example')
  })
})
