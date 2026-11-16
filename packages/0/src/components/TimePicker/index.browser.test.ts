import { afterEach, describe, expect, it } from 'vitest'

import { TimePicker, useTimePickerRoot } from './index'

// Utilities
import { isUndefined } from '#v0/utilities'
import { mount } from '@vue/test-utils'
import { createVNode, defineComponent, h, nextTick, shallowRef } from 'vue'

// Types
import type { TimePickerPeriodSlotProps, TimePickerRootContext, TimePickerRootSlotProps } from './index'
import type { VueWrapper } from '@vue/test-utils'
import type { Component, VNode } from 'vue'

// Vue's PatchFlags.PROPS: the vnode names its dynamic props.
const PROPS = 8

const wrappers: VueWrapper[] = []

afterEach(() => {
  while (wrappers.length > 0) {
    wrappers.pop()!.unmount()
  }
})

function fields (): VNode[] {
  return [
    h(TimePicker.Hour as Component, { key: 'hour' }),
    h(TimePicker.Minute as Component, { key: 'minute' }),
    h(TimePicker.Second as Component, { key: 'second' }),
    h(TimePicker.Period as Component, { key: 'period' }),
  ]
}

// The host owns the model the way an app does: the picker emits, the host
// re-renders, and the new prop reaches the picker on a later flush.
// With `lead` set, the Root vnode is built the way a compiled template
// builds it, so Vue applies changed props one at a time in template order:
// `true` lists `v-model` first, `false` lists it last.
function mountTime (
  props: Record<string, unknown> = {},
  slot: (root: TimePickerRootSlotProps) => VNode[] = fields,
  lead?: boolean,
) {
  const { modelValue = null, ...rest } = props
  const model = shallowRef(modelValue as string | null)
  const bound = shallowRef(rest)
  const emitted: (string | null)[] = []

  function onUpdate (value: string | null) {
    emitted.push(value)
    model.value = value
  }

  function root (): VNode {
    const all: Record<string, unknown> = { ...bound.value, modelValue: model.value }
    const children = { default: slot }
    if (isUndefined(lead)) {
      return h(TimePicker.Root as Component, { ...all, 'onUpdate:modelValue': onUpdate }, children)
    }

    const keys = Object.keys(bound.value)
    const dynamic = lead ? ['modelValue', ...keys] : [...keys, 'modelValue']
    const ordered: Record<string, unknown> = {}
    for (const key of dynamic) ordered[key] = all[key]
    ordered['onUpdate:modelValue'] = onUpdate

    return createVNode(TimePicker.Root as Component, ordered, children, PROPS, dynamic)
  }

  const Host = defineComponent({
    render: () => h('form', [root()]),
  })

  const wrapper = mount(Host, { attachTo: document.body })
  wrappers.push(wrapper)

  return {
    model,
    emitted,
    wrapper,
    part: (name: string) => wrapper.get(`[data-part="${name}"]`),
    set: (next: Record<string, unknown>) => {
      bound.value = { ...bound.value, ...next }
    },
    wait: () => nextTick(),
  }
}

function press (element: Element, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  })
  element.dispatchEvent(event)
  return event
}

describe('timePicker', () => {
  describe('rendering', () => {
    it('should render a group with hour and minute spinbuttons', async () => {
      const { wrapper, part, wait } = mountTime()
      await wait()

      expect(wrapper.find('[role="group"]').exists()).toBe(true)
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

    it('should omit the period control in a 24-hour cycle', async () => {
      const { wrapper, wait } = mountTime({ modelValue: '15:00' })
      await wait()

      expect(wrapper.find('[data-part="period"]').exists()).toBe(false)
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
  })

  describe('aria', () => {
    it('should describe a 24-hour time', async () => {
      const { part, wait } = mountTime({ modelValue: '09:30', minuteStep: 15 })
      await wait()

      expect(part('hour').attributes('aria-valuemin')).toBe('0')
      expect(part('hour').attributes('aria-valuemax')).toBe('23')
      expect(part('hour').attributes('aria-valuenow')).toBe('9')
      expect(part('hour').attributes('aria-valuetext')).toBe('09')
      expect(part('minute').attributes('aria-valuemin')).toBe('0')
      expect(part('minute').attributes('aria-valuemax')).toBe('45')
      expect(part('minute').attributes('aria-valuenow')).toBe('30')
    })

    it('should describe a 12-hour time', async () => {
      const { part, wait } = mountTime({ modelValue: '15:00', hourCycle: 'h12' })
      await wait()

      expect(part('hour').attributes('aria-valuemin')).toBe('1')
      expect(part('hour').attributes('aria-valuemax')).toBe('12')
      expect(part('hour').attributes('aria-valuenow')).toBe('3')
      expect(part('period').attributes('aria-valuemin')).toBe('0')
      expect(part('period').attributes('aria-valuemax')).toBe('1')
      expect(part('period').attributes('aria-valuenow')).toBe('1')
      expect(part('period').attributes('aria-valuetext')).toBeDefined()
      expect(part('period').attributes('aria-label')).toBeDefined()
    })

    it('should narrow the 12-hour range to the hours the step can reach', async () => {
      const { part, wait } = mountTime({ modelValue: '15:00', hourCycle: 'h12', hourStep: 5 })
      await wait()

      expect(part('hour').attributes('aria-valuemin')).toBe('3')
      expect(part('hour').attributes('aria-valuemax')).toBe('8')
    })

    it('should omit the current value while a field is empty', async () => {
      const { part, wait } = mountTime()
      await wait()

      expect(part('hour').attributes('aria-valuenow')).toBeUndefined()
      expect(part('hour').attributes('aria-valuetext')).toBeUndefined()
      expect(part('minute').attributes('aria-valuenow')).toBeUndefined()
    })
  })

  describe('keyboard', () => {
    it('should step the focused field with arrow keys', async () => {
      const { model, part, wait } = mountTime({ modelValue: '09:30' })
      await wait()

      expect(press(part('hour').element, 'ArrowUp').defaultPrevented).toBe(true)
      await wait()
      expect(model.value).toBe('10:30')

      expect(press(part('minute').element, 'ArrowDown').defaultPrevented).toBe(true)
      await wait()
      expect(model.value).toBe('10:29')
    })

    it.each(['Backspace', 'Delete'])('should clear the focused field with %s and keep the others', async key => {
      const { model, part, wait } = mountTime({ modelValue: '09:30' })
      await wait()

      expect(press(part('minute').element, key).defaultPrevented).toBe(true)
      await wait()

      expect(model.value).toBeNull()
      expect(part('minute').attributes('aria-valuenow')).toBeUndefined()
      expect(part('hour').attributes('aria-valuenow')).toBe('9')

      press(part('minute').element, 'ArrowUp')
      await wait()
      expect(model.value).toBe('09:00')
    })

    it('should jump to the ends of the grid with Home and End', async () => {
      const { model, part, wait } = mountTime({ modelValue: '09:30', minuteStep: 15 })
      await wait()

      expect(press(part('minute').element, 'End').defaultPrevented).toBe(true)
      await wait()
      expect(model.value).toBe('09:45')

      expect(press(part('minute').element, 'Home').defaultPrevented).toBe(true)
      await wait()
      expect(model.value).toBe('09:00')

      press(part('hour').element, 'End')
      await wait()
      expect(model.value).toBe('23:00')

      press(part('hour').element, 'Home')
      await wait()
      expect(model.value).toBe('00:00')
    })

    it('should jump to 1 and 12 inside the meridiem in a 12-hour cycle', async () => {
      const { model, part, wait } = mountTime({ modelValue: '15:00', hourCycle: 'h12' })
      await wait()

      press(part('hour').element, 'Home')
      await wait()
      expect(model.value).toBe('13:00')

      press(part('hour').element, 'End')
      await wait()
      expect(model.value).toBe('12:00')
    })

    it('should move about two hours or fifteen minutes with the Page keys', async () => {
      const { model, part, wait } = mountTime({ modelValue: '09:30' })
      await wait()

      expect(press(part('hour').element, 'PageUp').defaultPrevented).toBe(true)
      await wait()
      expect(model.value).toBe('11:30')

      expect(press(part('minute').element, 'PageDown').defaultPrevented).toBe(true)
      await wait()
      expect(model.value).toBe('11:15')
    })

    it('should never page by less than one interval', async () => {
      const { model, part, wait } = mountTime({ modelValue: '10:00', hourStep: 5, minuteStep: 20 })
      await wait()

      press(part('hour').element, 'PageUp')
      await wait()
      expect(model.value).toBe('15:00')

      press(part('minute').element, 'PageUp')
      await wait()
      expect(model.value).toBe('15:20')
    })

    it('should drive the period with arrows, Page keys, Home, and End', async () => {
      const { model, part, wait } = mountTime({ modelValue: '03:00', hourCycle: 'h12' })
      await wait()

      expect(press(part('period').element, 'ArrowUp').defaultPrevented).toBe(true)
      await wait()
      expect(model.value).toBe('15:00')
      expect(part('hour').attributes('aria-valuenow')).toBe('3')

      expect(press(part('period').element, 'PageDown').defaultPrevented).toBe(true)
      await wait()
      expect(model.value).toBe('03:00')

      expect(press(part('period').element, 'End').defaultPrevented).toBe(true)
      await wait()
      expect(model.value).toBe('15:00')

      expect(press(part('period').element, 'End').defaultPrevented).toBe(true)
      await wait()
      expect(model.value).toBe('15:00')

      expect(press(part('period').element, 'Home').defaultPrevented).toBe(true)
      await wait()
      expect(model.value).toBe('03:00')
    })

    it('should leave keys it does not act on alone', async () => {
      const { model, part, wait } = mountTime({ modelValue: '03:00', hourCycle: 'h12' })
      await wait()

      expect(press(part('hour').element, 'Tab').defaultPrevented).toBe(false)
      expect(press(part('hour').element, '5').defaultPrevented).toBe(false)
      expect(press(part('hour').element, 'Enter').defaultPrevented).toBe(false)
      expect(press(part('period').element, 'Backspace').defaultPrevented).toBe(false)
      expect(press(part('period').element, 'Delete').defaultPrevented).toBe(false)
      await wait()

      expect(model.value).toBe('03:00')
    })

    it('should step a native button host once', async () => {
      const { model, part, wait } = mountTime(
        { modelValue: '09:00' },
        () => [h(TimePicker.Hour as Component, { as: 'button', key: 'hour' })],
      )
      await wait()

      const hour = part('hour')
      expect(hour.element.tagName).toBe('BUTTON')
      expect(hour.attributes('type')).toBe('button')
      expect(hour.attributes('role')).toBe('spinbutton')

      press(hour.element, 'ArrowUp')
      await wait()
      expect(model.value).toBe('10:00')
    })
  })

  describe('blocked', () => {
    const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Backspace', 'Delete']

    it('should mark a disabled picker and ignore every key', async () => {
      const { model, wrapper, part, wait } = mountTime({
        modelValue: '04:07',
        minuteStep: 15,
        disabled: true,
      })
      await wait()

      const group = wrapper.get('[role="group"]')
      expect(group.attributes('aria-disabled')).toBe('true')
      expect(group.attributes('data-disabled')).toBe('true')
      expect(part('hour').attributes('aria-disabled')).toBe('true')
      expect(part('hour').attributes('data-disabled')).toBe('true')
      expect(part('hour').attributes('tabindex')).toBe('-1')

      for (const key of keys) {
        expect(press(part('minute').element, key).defaultPrevented).toBe(false)
      }
      await wait()

      expect(model.value).toBe('04:07')
      expect(part('minute').attributes('aria-valuenow')).toBe('7')
    })

    it('should mark a readonly picker and ignore every key', async () => {
      const { model, wrapper, part, wait } = mountTime({
        modelValue: '04:07',
        minuteStep: 15,
        readonly: true,
      })
      await wait()

      const group = wrapper.get('[role="group"]')
      expect(group.attributes('data-readonly')).toBe('true')
      expect(group.attributes('data-disabled')).toBeUndefined()
      expect(part('hour').attributes('aria-readonly')).toBe('true')
      expect(part('hour').attributes('data-readonly')).toBe('true')
      expect(part('hour').attributes('aria-disabled')).toBe('false')
      expect(part('hour').attributes('tabindex')).toBe('0')

      for (const key of keys) {
        expect(press(part('minute').element, key).defaultPrevented).toBe(false)
      }
      await wait()

      expect(model.value).toBe('04:07')
      expect(part('minute').attributes('aria-valuenow')).toBe('7')
    })
  })

  describe('controlled model', () => {
    it('should not emit on mount for a canonical value', async () => {
      const { emitted, model, wait } = mountTime({ modelValue: '09:30' })
      await wait()

      expect(emitted).toEqual([])
      expect(model.value).toBe('09:30')
    })

    it('should not emit back a canonical value the host sets after an edit', async () => {
      const { emitted, model, part, wait } = mountTime({ modelValue: '09:30' })
      await wait()

      press(part('minute').element, 'ArrowUp')
      await wait()
      expect(emitted).toEqual(['09:31'])

      model.value = '12:00'
      await wait()

      expect(emitted).toEqual(['09:31'])
      expect(part('hour').attributes('aria-valuenow')).toBe('12')
    })

    it('should emit the end state of two edits that return to the starting value', async () => {
      const { model, part, wait } = mountTime({ modelValue: '09:30' })
      await wait()

      press(part('minute').element, 'ArrowUp')
      press(part('minute').element, 'ArrowDown')
      await wait()
      await wait()

      expect(model.value).toBe('09:30')
      expect(part('minute').attributes('aria-valuenow')).toBe('30')
    })

    it('should emit a value re-entered in the same tick it was cleared', async () => {
      let time: TimePickerRootContext | undefined
      const Probe = defineComponent({
        setup () {
          time = useTimePickerRoot('v0:time-picker')
          return () => null
        },
      })

      const { model, part, wait } = mountTime({ modelValue: '09:30' }, () => [...fields(), h(Probe, { key: 'probe' })])
      await wait()

      time!.clear()
      time!.commit('hour', 9)
      time!.commit('minute', 30)
      await wait()
      await wait()

      expect(model.value).toBe('09:30')
      expect(part('hour').attributes('aria-valuenow')).toBe('9')
      expect(part('minute').attributes('aria-valuenow')).toBe('30')
    })

    describe.each([
      ['v-model listed last', false],
      ['v-model listed first', true],
    ])('with %s', (_, lead) => {
      it('should keep a model value that arrives together with a bound', async () => {
        const { model, set, wait } = mountTime({ modelValue: '08:00' }, fields, lead)
        await wait()

        set({ min: '09:00' })
        model.value = '10:00'
        await wait()
        await wait()

        expect(model.value).toBe('10:00')
      })

      it('should keep a model value that arrives as a bound is lifted', async () => {
        const { model, set, wait } = mountTime({ modelValue: '10:00', min: '09:00' }, fields, lead)
        await wait()

        set({ min: null })
        model.value = '08:30'
        await wait()
        await wait()

        expect(model.value).toBe('08:30')
      })

      it('should keep the seconds of a model value that arrives as seconds turn on', async () => {
        const { model, set, wait } = mountTime({ modelValue: '09:30' }, fields, lead)
        await wait()

        set({ seconds: true })
        model.value = '11:15:45'
        await wait()
        await wait()

        expect(model.value).toBe('11:15:45')
      })

      it('should keep a model value that arrives as a step is lifted', async () => {
        const { model, set, wait } = mountTime({ modelValue: '08:00', minuteStep: 15 }, fields, lead)
        await wait()

        set({ minuteStep: 1 })
        model.value = '08:07'
        await wait()
        await wait()

        expect(model.value).toBe('08:07')
      })

      it('should keep a model value that arrives as the picker is enabled', async () => {
        const { model, part, set, wait } = mountTime({ modelValue: '04:07', disabled: true, minuteStep: 15 }, fields, lead)
        await wait()

        set({ disabled: false })
        model.value = '10:30'
        await wait()
        await wait()

        expect(model.value).toBe('10:30')
        expect(part('hour').attributes('aria-valuenow')).toBe('10')
      })
    })
  })

  describe('slot props', () => {
    it('should expose the meridiem as the period value', async () => {
      let captured: TimePickerPeriodSlotProps | undefined

      const { part, wait } = mountTime(
        { modelValue: '15:00', hourCycle: 'h12' },
        () => [
          h(TimePicker.Period as Component, { key: 'period' }, {
            default: (props: TimePickerPeriodSlotProps) => {
              captured = props
              return props.text
            },
          }),
        ],
      )
      await wait()

      expect(captured?.value).toBe('pm')
      expect(captured?.attrs['aria-valuenow']).toBe(1)

      press(part('period').element, 'ArrowDown')
      await wait()

      expect(captured?.value).toBe('am')
      expect(captured?.attrs['aria-valuenow']).toBe(0)
    })

    it('should clear every field through the root slot', async () => {
      let root: TimePickerRootSlotProps | undefined

      const { model, part, wait } = mountTime({ modelValue: '09:30' }, props => {
        root = props
        return fields()
      })
      await wait()

      root!.clear()
      await wait()

      expect(model.value).toBeNull()
      expect(root!.value).toBeNull()
      expect(part('hour').attributes('aria-valuenow')).toBeUndefined()
      expect(part('minute').attributes('aria-valuenow')).toBeUndefined()
    })
  })

  describe('form', () => {
    it('should submit the stepped value through a hidden input when name is set', async () => {
      const { wrapper, part, wait } = mountTime({ modelValue: '09:30', name: 'alarm' })
      await wait()

      const input = wrapper.get('input[type="hidden"]')
      expect(input.attributes('name')).toBe('alarm')
      expect(input.attributes('tabindex')).toBe('-1')
      expect((input.element as HTMLInputElement).value).toBe('09:30')

      press(part('hour').element, 'ArrowUp')
      await wait()

      expect((input.element as HTMLInputElement).value).toBe('10:30')
      expect(new FormData(wrapper.element as HTMLFormElement).get('alarm')).toBe('10:30')

      press(part('minute').element, 'Delete')
      await wait()

      expect(new FormData(wrapper.element as HTMLFormElement).get('alarm')).toBe('')
    })

    it('should render no hidden input without a name', async () => {
      const { wrapper, wait } = mountTime({ modelValue: '09:30' })
      await wait()

      expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)
    })
  })
})
