import { afterEach, describe, expect, it } from 'vitest'

import { Otp } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

// Types
import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'

const wrappers: VueWrapper[] = []

afterEach(() => {
  while (wrappers.length > 0) {
    wrappers.pop()!.unmount()
  }
})

function mountOtp (options: {
  props?: Record<string, unknown>
  model?: ReturnType<typeof ref<string>>
  length?: number
} = {}) {
  let wrapper: VueWrapper

  const props: Record<string, unknown> = {
    ...(options.model && {
      'modelValue': options.model.value,
      'onUpdate:modelValue': (v: unknown) => {
        options.model!.value = v as string
        wrapper.setProps({ modelValue: v })
      },
    }),
    length: options.length ?? 6,
    ...options.props,
  }

  wrapper = mount(Otp.Root as Component, {
    props,
    slots: {
      default: () => Array.from({ length: options.length ?? 6 }, (_, i) =>
        h(Otp.Item as Component, { key: i, index: i }),
      ),
    },
    attachTo: document.body,
  })

  wrappers.push(wrapper)

  return {
    wrapper,
    itemEls: () => wrapper.findAll('input:not([type="hidden"])'),
    wait: () => nextTick(),
  }
}

describe('otp', () => {
  it('should overwrite a filled cell by typing without backspace', async () => {
    const model = ref('1')
    const { itemEls, wait } = mountOtp({ model, length: 4 })
    await wait()

    const input = itemEls()[0]!.element as HTMLInputElement
    input.focus()
    await wait()

    input.dispatchEvent(new InputEvent('beforeinput', {
      data: '9',
      inputType: 'insertText',
      bubbles: true,
      cancelable: true,
    }))
    await wait()

    expect(model.value.startsWith('9')).toBe(true)
    expect(document.activeElement).toBe(itemEls()[1]!.element)
  })

  it('should distribute a multi-character input event as autofill', async () => {
    const model = ref('')
    const { itemEls, wait } = mountOtp({ model, length: 4 })
    await wait()

    const input = itemEls()[0]!.element as HTMLInputElement
    input.value = '1234'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await wait()

    expect(model.value).toBe('1234')
    expect(document.activeElement).toBe(itemEls()[3]!.element)
  })

  it('should focus the next empty box when pasting into a later box on an empty value', async () => {
    const model = ref('')
    const { itemEls, wait } = mountOtp({ model, length: 6 })
    await wait()

    const dataTransfer = new DataTransfer()
    dataTransfer.setData('text/plain', '12')
    itemEls()[3]!.element.dispatchEvent(new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    }))
    await wait()

    expect(model.value).toBe('12')
    expect(document.activeElement).toBe(itemEls()[2]!.element)
  })
})
