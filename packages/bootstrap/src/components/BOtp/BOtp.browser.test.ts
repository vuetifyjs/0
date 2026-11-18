import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BOtp } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { VNode } from 'vue'

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

describe('bOtp', () => {
  it('should conform to the basic otp fixture', async () => {
    const host = mount(() => h(BOtp))
    await settle()

    // The digit sits in the corner unless the input carries the slot's own
    // size. That style is not in the pin, so the fixture stays unmarked.
    conform(host.querySelector('.otp')!, 'otp:basic', { ignoreAttrs: ['style'] })
    const input = host.querySelector<HTMLElement>('.otp-input')!
    expect(input.style.textAlign).toBe('center')
    expect(input.style.width).toBe('var(--bs-otp-size)')
    expect(input.hasAttribute('maxlength')).toBe(false)
    expect(host.innerHTML).not.toContain('data-bs-otp')
  })

  it('should add the connected class and honor length', async () => {
    const host = mount(() => h(BOtp, { connected: true, length: 4 }))
    await settle()

    const root = host.querySelector('.otp')!
    expect(root.classList.contains('otp-connected')).toBe(true)
    expect(root.querySelectorAll('.otp-input')).toHaveLength(4)
  })

  it('should write a digit into the model', async () => {
    const model = shallowRef('')
    const host = mount(() => h(BOtp, {
      'modelValue': model.value,
      'onUpdate:modelValue': (value: string) => {
        model.value = value
      },
    }))
    await settle()

    await userEvent.click(host.querySelector('.otp-input')!)
    await userEvent.keyboard('1')
    await settle()

    expect(model.value).toBe('1')
  })
})
