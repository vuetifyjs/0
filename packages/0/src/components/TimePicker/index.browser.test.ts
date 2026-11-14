import { afterEach, describe, expect, it } from 'vitest'

import { TimePicker } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, shallowRef } from 'vue'

// Types
import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'

const wrappers: VueWrapper[] = []

afterEach(() => {
  while (wrappers.length > 0) {
    wrappers.pop()!.unmount()
  }
})

function mountTime (props: Record<string, unknown> = {}) {
  const model = shallowRef<string | null>((props.modelValue as string | null | undefined) ?? null)

  const wrapper = mount(TimePicker.Root as Component, {
    props: {
      ...props,
      'modelValue': model.value,
      'onUpdate:modelValue': (value: string | null) => {
        model.value = value
        return wrapper.setProps({ modelValue: value })
      },
    },
    slots: {
      default: () => [
        h(TimePicker.Hour as Component, { key: 'hour' }),
        h(TimePicker.Minute as Component, { key: 'minute' }),
        h(TimePicker.Second as Component, { key: 'second' }),
        h(TimePicker.Period as Component, { key: 'period' }),
      ],
    },
    attachTo: document.body,
  })

  wrappers.push(wrapper)

  return {
    model,
    wrapper,
    part: (name: string) => wrapper.get(`[data-part="${name}"]`),
    wait: () => nextTick(),
  }
}

function press (element: Element, key: string) {
  element.dispatchEvent(new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  }))
}

describe('timePicker', () => {
  it('should expose hour and minute spinbuttons', async () => {
    const { wrapper, part, wait } = mountTime()
    await wait()

    expect(wrapper.get('[role="group"]').attributes('role')).toBe('group')
    expect(part('hour').attributes('role')).toBe('spinbutton')
    expect(part('minute').attributes('role')).toBe('spinbutton')
    expect(wrapper.findAll('[role="spinbutton"]')).toHaveLength(2)
  })

  it('should name the group and the fields from the locale catalog', async () => {
    const { wrapper, part, wait } = mountTime()
    await wait()

    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBeDefined()
    expect(part('hour').attributes('aria-label')).toBeDefined()
    expect(part('minute').attributes('aria-label')).toBeDefined()
  })

  it('should step the focused field with arrow keys', async () => {
    const { model, part, wait } = mountTime({ modelValue: '09:30' })
    await wait()

    press(part('hour').element, 'ArrowUp')
    await wait()
    expect(model.value).toBe('10:30')

    press(part('minute').element, 'ArrowDown')
    await wait()
    expect(model.value).toBe('10:29')
  })

  it('should omit the period control in a 24-hour cycle', async () => {
    const { wrapper, wait } = mountTime({ modelValue: '15:00' })
    await wait()

    expect(wrapper.find('[data-part="period"]').exists()).toBe(false)
  })

  it('should render the period control in a 12-hour cycle and step it', async () => {
    const { model, part, wait } = mountTime({
      modelValue: '03:00',
      hourCycle: 'h12',
    })
    await wait()

    expect(part('period').attributes('role')).toBe('spinbutton')
    expect(part('period').attributes('aria-label')).toBeDefined()
    expect(part('hour').attributes('aria-valuenow')).toBe('3')

    press(part('period').element, 'ArrowUp')
    await wait()

    expect(model.value).toBe('15:00')
    expect(part('hour').attributes('aria-valuenow')).toBe('3')
  })

  it('should omit seconds unless they are enabled', async () => {
    const off = mountTime({ modelValue: '09:30' })
    await off.wait()
    expect(off.wrapper.find('[data-part="second"]').exists()).toBe(false)

    const on = mountTime({ modelValue: '09:30:00', seconds: true })
    await on.wait()
    expect(on.part('second').attributes('role')).toBe('spinbutton')

    press(on.part('second').element, 'ArrowUp')
    await on.wait()
    expect(on.model.value).toBe('09:30:01')
  })

  it('should submit the value through a hidden input when name is set', async () => {
    const named = mountTime({ modelValue: '09:30', name: 'alarm' })
    await named.wait()

    const input = named.wrapper.get('input[type="hidden"]')
    expect(input.attributes('name')).toBe('alarm')
    expect(input.attributes('tabindex')).toBe('-1')
    expect((input.element as HTMLInputElement).value).toBe('09:30')

    const plain = mountTime({ modelValue: '09:30' })
    await plain.wait()
    expect(plain.wrapper.find('input[type="hidden"]').exists()).toBe(false)
  })

  it('should ignore arrow keys while disabled', async () => {
    const { model, part, wait } = mountTime({
      modelValue: '04:00',
      disabled: true,
    })
    await wait()

    press(part('hour').element, 'ArrowUp')
    await wait()
    expect(model.value).toBe('04:00')
  })

  it('should step a native button host once', async () => {
    const model = shallowRef<string | null>('09:00')

    const wrapper = mount(TimePicker.Root as Component, {
      props: {
        'modelValue': model.value,
        'onUpdate:modelValue': (value: string | null) => {
          model.value = value
          return wrapper.setProps({ modelValue: value })
        },
      },
      slots: {
        default: () => h(TimePicker.Hour as Component, { as: 'button', key: 'hour' }),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const hour = wrapper.get('[data-part="hour"]')
    expect(hour.element.tagName).toBe('BUTTON')
    expect(hour.attributes('type')).toBe('button')
    expect(hour.attributes('role')).toBe('spinbutton')

    press(hour.element, 'ArrowUp')
    await nextTick()
    expect(model.value).toBe('10:00')
  })
})
