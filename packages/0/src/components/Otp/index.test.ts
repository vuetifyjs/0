import { describe, expect, it, vi } from 'vitest'

import { Otp } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

// Types
import type { VueWrapper } from '@vue/test-utils'

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

  wrapper = mount(Otp.Root, {
    props,
    slots: {
      default: () => Array.from({ length: options.length ?? 6 }, (_, i) =>
        h(Otp.Item as any, { key: i, index: i }),
      ),
    },
    attachTo: document.body,
  })

  return {
    wrapper,
    groupEl: () => wrapper.find('[role="group"]'),
    itemEls: () => wrapper.findAll('input'),
    wait: () => nextTick(),
  }
}

describe('otp', () => {
  describe('rendering', () => {
    it('should render a role=group container', () => {
      const { groupEl } = mountOtp()
      expect(groupEl().exists()).toBe(true)
    })

    it('should render one input per length', () => {
      const { itemEls } = mountOtp({ length: 4 })
      expect(itemEls()).toHaveLength(4)
    })

    it('should default the aria-label', () => {
      const { groupEl } = mountOtp()
      expect(groupEl().attributes('aria-label')).toBe('Verification code')
    })

    it('should use a custom ariaLabel', () => {
      const { groupEl } = mountOtp({ props: { ariaLabel: 'Enter your code' } })
      expect(groupEl().attributes('aria-label')).toBe('Enter your code')
    })

    it('should suppress aria-label when ariaLabelledby is set', () => {
      const { groupEl } = mountOtp({ props: { ariaLabelledby: 'code-heading' } })
      expect(groupEl().attributes('aria-label')).toBeUndefined()
      expect(groupEl().attributes('aria-labelledby')).toBe('code-heading')
    })

    it('should label each item with its position', () => {
      const { itemEls } = mountOtp({ length: 3 })
      const labels = itemEls().map(el => el.attributes('aria-label'))
      expect(labels).toEqual(['Digit 1 of 3', 'Digit 2 of 3', 'Digit 3 of 3'])
    })
  })

  describe('v-model', () => {
    it('should render each character in its box', async () => {
      const model = ref('12')
      const { itemEls, wait } = mountOtp({ model, length: 4 })
      await wait()

      const values = itemEls().map(el => (el.element as HTMLInputElement).value)
      expect(values).toEqual(['1', '2', '', ''])
    })

    it('should write a typed character and advance focus', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, length: 3 })
      await wait()

      await itemEls()[0]!.setValue('4')
      await wait()

      expect(model.value).toBe('4')
      expect(document.activeElement).toBe(itemEls()[1]!.element)
    })

    it('should ignore a character the pattern rejects', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, length: 3 })
      await wait()

      await itemEls()[0]!.setValue('a')
      await wait()

      expect(model.value).toBe('')
    })

    it('should revert the box DOM value when the pattern rejects the keystroke', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, length: 3 })
      await wait()

      await itemEls()[0]!.setValue('a')
      await wait()

      expect((itemEls()[0]!.element as HTMLInputElement).value).toBe('')
    })

    it('should prevent a rejected keystroke via beforeinput', async () => {
      const { itemEls, wait } = mountOtp({ length: 3 })
      await wait()

      const input = itemEls()[0]!.element as HTMLInputElement
      const event = new Event('beforeinput', { cancelable: true }) as InputEvent
      Object.defineProperty(event, 'data', { value: 'a' })
      Object.defineProperty(event, 'target', { value: input })
      input.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
    })

    it('should allow an accepted keystroke via beforeinput', async () => {
      const { itemEls, wait } = mountOtp({ length: 3 })
      await wait()

      const input = itemEls()[0]!.element as HTMLInputElement
      const event = new Event('beforeinput', { cancelable: true }) as InputEvent
      Object.defineProperty(event, 'data', { value: '4' })
      Object.defineProperty(event, 'target', { value: input })
      input.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(false)
    })

    it('should ignore multi-character beforeinput data', async () => {
      const { itemEls, wait } = mountOtp({ length: 3 })
      await wait()

      const input = itemEls()[0]!.element as HTMLInputElement
      const event = new Event('beforeinput', { cancelable: true }) as InputEvent
      Object.defineProperty(event, 'data', { value: 'ab' })
      Object.defineProperty(event, 'target', { value: input })
      input.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(false)
    })

    it('should clear a filled box on native backspace without moving focus', async () => {
      const model = ref('1')
      const { itemEls, wait } = mountOtp({ model, length: 3 })
      await wait()

      await itemEls()[0]!.setValue('')
      await wait()

      expect(model.value).toBe('')
      expect(document.activeElement).not.toBe(itemEls()[1]!.element)
    })

    it('should move focus back and clear the previous box on backspace from empty', async () => {
      const model = ref('1')
      const { itemEls, wait } = mountOtp({ model, length: 3 })
      await wait()

      await itemEls()[1]!.trigger('keydown', { key: 'Backspace' })
      await wait()

      expect(model.value).toBe('')
      expect(document.activeElement).toBe(itemEls()[0]!.element)
    })

    it('should no-op backspace on an empty first box', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, length: 3 })
      await wait()

      const first = itemEls()[0]!.element as HTMLInputElement
      first.focus()
      await itemEls()[0]!.trigger('keydown', { key: 'Backspace' })
      await wait()

      expect(model.value).toBe('')
      expect(document.activeElement).toBe(first)
    })

    it('should move focus with arrow keys', async () => {
      const { itemEls, wait } = mountOtp({ length: 3 })
      await wait()

      await itemEls()[0]!.trigger('keydown', { key: 'ArrowRight' })
      await wait()
      expect(document.activeElement).toBe(itemEls()[1]!.element)

      await itemEls()[1]!.trigger('keydown', { key: 'ArrowLeft' })
      await wait()
      expect(document.activeElement).toBe(itemEls()[0]!.element)
    })

    it('should clamp arrow navigation at both ends', async () => {
      const { itemEls, wait } = mountOtp({ length: 3 })
      await wait()

      const first = itemEls()[0]!.element as HTMLInputElement
      const last = itemEls()[2]!.element as HTMLInputElement

      first.focus()
      await itemEls()[0]!.trigger('keydown', { key: 'ArrowLeft' })
      await wait()
      expect(document.activeElement).toBe(first)

      last.focus()
      await itemEls()[2]!.trigger('keydown', { key: 'ArrowRight' })
      await wait()
      expect(document.activeElement).toBe(last)
    })

    it('should keep focus on the last box when typing into it', async () => {
      const model = ref('12')
      const { itemEls, wait } = mountOtp({ model, length: 3 })
      await wait()

      await itemEls()[2]!.setValue('3')
      await wait()

      expect(model.value).toBe('123')
      expect(document.activeElement).toBe(itemEls()[2]!.element)
    })

    it('should distribute pasted text across boxes and focus past the last written box', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, length: 4 })
      await wait()

      const dataTransfer = { getData: () => '1234' }
      await itemEls()[0]!.trigger('paste', { clipboardData: dataTransfer })
      await wait()

      expect(model.value).toBe('1234')
    })
  })

  describe('paste', () => {
    it('should filter rejected characters out of pasted text', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, length: 4 })
      await wait()

      const dataTransfer = { getData: () => '1a2b' }
      await itemEls()[0]!.trigger('paste', { clipboardData: dataTransfer })
      await wait()

      expect(model.value).toBe('12')
      expect(document.activeElement).toBe(itemEls()[2]!.element)
    })

    it('should ignore a paste with no accepted characters', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, length: 4 })
      await wait()

      const first = itemEls()[0]!.element as HTMLInputElement
      first.focus()
      const dataTransfer = { getData: () => 'abc' }
      await itemEls()[0]!.trigger('paste', { clipboardData: dataTransfer })
      await wait()

      expect(model.value).toBe('')
      expect(document.activeElement).toBe(first)
    })

    it('should truncate a paste longer than length', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, length: 4 })
      await wait()

      const dataTransfer = { getData: () => '123456789' }
      await itemEls()[0]!.trigger('paste', { clipboardData: dataTransfer })
      await wait()

      expect(model.value).toBe('1234')
      expect(document.activeElement).toBe(itemEls()[3]!.element)
    })

    it('should focus the next empty box when pasting into a later box with a short value', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, length: 6 })
      await wait()

      const dataTransfer = { getData: () => '12' }
      await itemEls()[3]!.trigger('paste', { clipboardData: dataTransfer })
      await wait()

      expect(model.value).toBe('12')
      expect(document.activeElement).toBe(itemEls()[2]!.element)
    })

    it('should not distribute while disabled', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, props: { disabled: true } })
      await wait()

      const dataTransfer = { getData: () => '1234' }
      await itemEls()[0]!.trigger('paste', { clipboardData: dataTransfer })
      await wait()

      expect(model.value).toBe('')
    })
  })

  describe('pattern', () => {
    it('should set inputmode numeric for the numeric pattern', () => {
      const { itemEls } = mountOtp()
      expect(itemEls()[0]!.attributes('inputmode')).toBe('numeric')
    })

    it('should accept letters with the alphanumeric pattern', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, props: { pattern: 'alphanumeric' } })
      await wait()

      expect(itemEls()[0]!.attributes('inputmode')).toBe('text')

      await itemEls()[0]!.setValue('a')
      await wait()

      expect(model.value).toBe('a')
    })

    it('should apply a custom RegExp pattern per character', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, props: { pattern: /^[0-7]$/ } })
      await wait()

      await itemEls()[0]!.setValue('8')
      await wait()
      expect(model.value).toBe('')

      await itemEls()[0]!.setValue('7')
      await wait()
      expect(model.value).toBe('7')
    })

    it('should react to a pattern prop change', async () => {
      const model = ref('')
      const { wrapper, itemEls, wait } = mountOtp({ model })
      await wait()

      expect(itemEls()[0]!.attributes('inputmode')).toBe('numeric')

      await wrapper.setProps({ pattern: 'alphabetic' })
      await wait()

      expect(itemEls()[0]!.attributes('inputmode')).toBe('text')

      await itemEls()[0]!.setValue('z')
      await wait()

      expect(model.value).toBe('z')
    })
  })

  describe('disabled state', () => {
    it('should mark the group aria-disabled', () => {
      const { groupEl } = mountOtp({ props: { disabled: true } })
      expect(groupEl().attributes('aria-disabled')).toBe('true')
    })

    it('should mark items disabled and data-disabled', () => {
      const { itemEls } = mountOtp({ props: { disabled: true } })
      expect(itemEls()[0]!.attributes('disabled')).toBeDefined()
      expect(itemEls()[0]!.attributes('data-disabled')).toBe('true')
    })

    it('should not write while disabled', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, props: { disabled: true } })
      await wait()

      await itemEls()[0]!.setValue('4')
      await wait()

      expect(model.value).toBe('')
    })
  })

  describe('readonly state', () => {
    it('should mark the group and items data-readonly', () => {
      const { groupEl, itemEls } = mountOtp({ props: { readonly: true } })
      expect(groupEl().attributes('data-readonly')).toBe('true')
      expect(itemEls()[0]!.attributes('readonly')).toBeDefined()
      expect(itemEls()[0]!.attributes('data-readonly')).toBe('true')
    })

    it('should not write while readonly', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, props: { readonly: true } })
      await wait()

      await itemEls()[0]!.setValue('4')
      await wait()

      expect(model.value).toBe('')
    })
  })

  describe('name prop', () => {
    it('should render a hidden input with the joined value', async () => {
      const model = ref('123')
      const { wrapper, wait } = mountOtp({ model, props: { name: 'code' } })
      await wait()

      const hidden = wrapper.find('input[type="hidden"]')
      expect(hidden.exists()).toBe(true)
      expect(hidden.attributes('name')).toBe('code')
      expect((hidden.element as HTMLInputElement).value).toBe('123')
    })

    it('should keep the hidden input in sync as the value changes', async () => {
      const model = ref('')
      const { wrapper, itemEls, wait } = mountOtp({ model, length: 3, props: { name: 'code' } })
      await wait()

      await itemEls()[0]!.setValue('4')
      await wait()

      const hidden = wrapper.find('input[type="hidden"]')
      expect((hidden.element as HTMLInputElement).value).toBe('4')
    })

    it('should disable the hidden input when disabled', () => {
      const { wrapper } = mountOtp({ props: { name: 'code', disabled: true } })
      const hidden = wrapper.find('input[type="hidden"]')
      expect(hidden.attributes('disabled')).toBeDefined()
    })

    it('should not render a hidden input without name', () => {
      const { wrapper } = mountOtp()
      expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)
    })
  })

  describe('onComplete', () => {
    it('should mark data-complete when the value reaches length', async () => {
      const model = ref('12345')
      const { groupEl, itemEls, wait } = mountOtp({ model, length: 6 })
      await wait()

      await itemEls()[5]!.setValue('6')
      await wait()

      expect(groupEl().attributes('data-complete')).toBe('true')
    })

    it('should call onComplete once with the joined value', async () => {
      const onComplete = vi.fn()
      const model = ref('')
      const { itemEls, wait } = mountOtp({ model, length: 2, props: { onComplete } })
      await wait()

      await itemEls()[0]!.setValue('1')
      await wait()
      await itemEls()[1]!.setValue('2')
      await wait()

      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(onComplete).toHaveBeenCalledWith('12')
    })

    it('should call onComplete again after clearing and refilling', async () => {
      const onComplete = vi.fn()
      const model = ref('1')
      const { itemEls, wait } = mountOtp({ model, length: 2, props: { onComplete } })
      await wait()

      await itemEls()[1]!.setValue('2')
      await wait()
      expect(onComplete).toHaveBeenCalledTimes(1)

      await itemEls()[1]!.setValue('')
      await wait()
      await itemEls()[1]!.setValue('3')
      await wait()

      expect(onComplete).toHaveBeenCalledTimes(2)
      expect(onComplete).toHaveBeenLastCalledWith('13')
    })

    it('should mark aria-busy while an async onComplete is pending', async () => {
      let resolve!: (value: boolean) => void
      const pending = new Promise<boolean>(r => {
        resolve = r
      })
      const model = ref('1')
      const { groupEl, itemEls, wait } = mountOtp({
        model,
        length: 2,
        props: { onComplete: () => pending },
      })
      await wait()

      await itemEls()[1]!.setValue('2')
      await wait()

      expect(groupEl().attributes('aria-busy')).toBe('true')

      resolve(true)
      await wait()
      await wait()

      expect(groupEl().attributes('aria-busy')).toBeUndefined()
    })

    it('should revert a keystroke while an async onComplete is pending', async () => {
      let resolve!: (value: boolean) => void
      const pending = new Promise<boolean>(r => {
        resolve = r
      })
      const model = ref('1')
      const { itemEls, wait } = mountOtp({
        model,
        length: 2,
        props: { onComplete: () => pending },
      })
      await wait()

      await itemEls()[1]!.setValue('2')
      await wait()

      await itemEls()[0]!.setValue('9')
      await wait()

      expect(model.value).toBe('12')
      expect((itemEls()[0]!.element as HTMLInputElement).value).toBe('1')

      resolve(true)
      await wait()
    })

    it('should reject and clear when onComplete resolves false', async () => {
      const model = ref('')
      const { itemEls, wait } = mountOtp({
        model,
        length: 2,
        props: { onComplete: () => false },
      })
      await wait()

      await itemEls()[0]!.setValue('1')
      await wait()
      await itemEls()[1]!.setValue('2')
      await wait()

      expect(model.value).toBe('')
    })
  })

  describe('expose', () => {
    it('should expose focusItem clamped to the boxes', async () => {
      const { wrapper, itemEls, wait } = mountOtp({ length: 3 })
      await wait()

      const vm = wrapper.vm as unknown as { focusItem: (index: number) => void }

      vm.focusItem(1)
      expect(document.activeElement).toBe(itemEls()[1]!.element)

      vm.focusItem(99)
      expect(document.activeElement).toBe(itemEls()[2]!.element)
    })
  })
})
