import { afterEach, describe, expect, it, vi } from 'vitest'

// Components
import { Form } from '#v0/components/Form'

// Composables
import { createLocalePlugin, LocaleAdapter } from '#v0/composables/useLocale'

import { TimePicker, useTimePickerRoot } from './index'

// Utilities
import { isNull, isUndefined } from '#v0/utilities'
import { flushPromises, mount } from '@vue/test-utils'
import { createVNode, defineComponent, h, nextTick, shallowRef } from 'vue'

// Types
import type { TimePickerHourSlotProps, TimePickerPeriodSlotProps, TimePickerRootContext, TimePickerRootSlotProps } from './index'
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
// `accept` stands in for a host that vets updates: it returns what the host
// stores for an emitted value.
function mountTime (
  props: Record<string, unknown> = {},
  slot: (root: TimePickerRootSlotProps) => VNode[] = fields,
  lead?: boolean,
  accept: (value: string | null, current: string | null) => string | null = value => value,
) {
  const { modelValue = null, ...rest } = props
  const model = shallowRef(modelValue as string | null)
  const bound = shallowRef(rest)
  const emitted: (string | null)[] = []

  function onUpdate (value: string | null) {
    emitted.push(value)
    model.value = accept(value, model.value)
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

// A refused write is noticed one tick after the flush that follows it, and
// the fields it puts back render on the flush after that.
async function answered () {
  await nextTick()
  await nextTick()
  await nextTick()
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

  describe('options', () => {
    it('should pass the second step and both bounds through to the picker', async () => {
      const { model, part, wait } = mountTime({
        modelValue: '10:00:00',
        seconds: true,
        secondStep: 20,
        min: '10:00:10',
        max: '10:00:50',
      })
      await wait()
      await wait()

      expect(model.value).toBe('10:00:20')
      expect(part('second').attributes('aria-valuemax')).toBe('40')

      press(part('second').element, 'ArrowUp')
      await wait()
      expect(model.value).toBe('10:00:40')

      press(part('second').element, 'ArrowUp')
      await wait()
      expect(model.value).toBe('10:00:20')
    })

    it('should connect fields and the hidden input through a custom namespace', async () => {
      const { model, wrapper, part, wait } = mountTime(
        { modelValue: '09:30', name: 'alarm', namespace: 'v0:alarm' },
        () => [h(TimePicker.Hour as Component, { key: 'hour', namespace: 'v0:alarm' })],
      )
      await wait()

      press(part('hour').element, 'ArrowUp')
      await wait()

      expect(model.value).toBe('10:30')
      expect((wrapper.get('input[type="hidden"]').element as HTMLInputElement).value).toBe('10:30')
    })
  })

  describe('state hooks', () => {
    it('should mark each field empty or filled and the group complete', async () => {
      const { wrapper, part, wait } = mountTime({ modelValue: '09:30' })
      await wait()

      const group = wrapper.get('[role="group"]')
      expect(group.attributes('data-complete')).toBe('true')
      expect(part('hour').attributes('data-state')).toBe('filled')
      expect(part('minute').attributes('data-state')).toBe('filled')

      press(part('minute').element, 'Delete')
      await wait()

      expect(group.attributes('data-complete')).toBeUndefined()
      expect(part('hour').attributes('data-state')).toBe('filled')
      expect(part('minute').attributes('data-state')).toBe('empty')
    })

    it('should not call a model the fields cannot show complete', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { model, wrapper, wait } = mountTime({ modelValue: 'bogus', readonly: true })
      await wait()

      expect(model.value).toBe('bogus')
      expect(wrapper.get('[role="group"]').attributes('data-complete')).toBeUndefined()
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('aria', () => {
    it('should describe a 24-hour time', async () => {
      const { part, wait } = mountTime({ modelValue: '09:30', minuteStep: 15 })
      await wait()

      expect(part('hour').attributes('aria-valuemin')).toBe('0')
      expect(part('hour').attributes('aria-valuemax')).toBe('23')
      expect(part('hour').attributes('aria-valuenow')).toBe('9')
      expect(part('hour').attributes('aria-valuetext')).toBeUndefined()
      expect(part('minute').attributes('aria-valuetext')).toBeUndefined()
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

    it('should speak a 12-hour hour with its meridiem', async () => {
      const { part, wait } = mountTime({ modelValue: '15:00', hourCycle: 'h12' })
      await wait()

      expect(part('hour').attributes('aria-valuetext')).toBe('3 PM')
      expect(part('minute').attributes('aria-valuetext')).toBeUndefined()
    })

    it.each([['readonly'], ['disabled']])('should report the whole field as the range while %s', async flag => {
      const { part, set, wait } = mountTime({ modelValue: '04:50', minuteStep: 15, hourStep: 5, [flag]: true })
      await wait()

      expect(part('minute').attributes('aria-valuenow')).toBe('50')
      expect(part('minute').attributes('aria-valuemin')).toBe('0')
      expect(part('minute').attributes('aria-valuemax')).toBe('59')
      expect(part('hour').attributes('aria-valuemin')).toBe('0')
      expect(part('hour').attributes('aria-valuemax')).toBe('23')

      set({ hourCycle: 'h12' })
      await wait()

      expect(part('hour').attributes('aria-valuemin')).toBe('1')
      expect(part('hour').attributes('aria-valuemax')).toBe('12')
    })

    it('should name the group and the fields from props', async () => {
      const { wrapper, part, wait } = mountTime({ modelValue: '09:30', ariaLabel: 'Start', ariaDescribedby: 'hint' }, () => [
        h(TimePicker.Hour as Component, { key: 'hour', ariaLabel: 'Start hour' }),
        h(TimePicker.Minute as Component, { 'key': 'minute', 'aria-label': 'Start minute' }),
      ])
      await wait()

      const group = wrapper.get('[role="group"]')
      expect(group.attributes('aria-label')).toBe('Start')
      expect(group.attributes('aria-describedby')).toBe('hint')
      expect(part('hour').attributes('aria-label')).toBe('Start hour')
      expect(part('minute').attributes('aria-label')).toBe('Start minute')
    })

    it('should drop the default name when the group or a field is labelled by an element', async () => {
      const { wrapper, part, wait } = mountTime({ modelValue: '09:30', ariaLabelledby: 'legend' }, () => [
        h(TimePicker.Hour as Component, { key: 'hour', ariaLabelledby: 'hour-label' }),
        h(TimePicker.Minute as Component, { key: 'minute' }),
      ])
      await wait()

      const group = wrapper.get('[role="group"]')
      expect(group.attributes('aria-labelledby')).toBe('legend')
      expect(group.attributes('aria-label')).toBeUndefined()
      expect(part('hour').attributes('aria-labelledby')).toBe('hour-label')
      expect(part('hour').attributes('aria-label')).toBeUndefined()
      expect(part('minute').attributes('aria-label')).toBeDefined()
    })

    it('should derive field ids from the group and let a field override its own', async () => {
      const { part, wait } = mountTime({ modelValue: '09:30', id: 'start' }, () => [
        h(TimePicker.Hour as Component, { key: 'hour' }),
        h(TimePicker.Minute as Component, { key: 'minute', id: 'custom' }),
      ])
      await wait()

      expect(part('hour').attributes('id')).toBe('start-hour')
      expect(part('minute').attributes('id')).toBe('custom')
    })

    it('should widen the reported range to hold a value that sits off the grid', async () => {
      const { model, part, wait } = mountTime({ modelValue: '11:00', minuteStep: 15, min: '10:50', max: '10:55' })
      await wait()
      await wait()

      expect(model.value).toBe('10:55')
      expect(part('minute').attributes('aria-valuenow')).toBe('55')
      expect(part('minute').attributes('aria-valuemin')).toBe('0')
      expect(part('minute').attributes('aria-valuemax')).toBe('55')
    })

    it.each([
      ['hour', TimePicker.Hour],
      ['minute', TimePicker.Minute],
      ['second', TimePicker.Second],
      ['period', TimePicker.Period],
    ] as const)('should forward id, names, and namespace on the %s part', async (name, Part) => {
      const props = { modelValue: '15:30:00', hourCycle: 'h12', seconds: true, namespace: 'v0:alarm' }

      const named = mountTime(props, () => [
        h(Part as Component, { key: name, namespace: 'v0:alarm', id: 'custom', ariaLabel: 'Custom' }),
      ])
      await named.wait()

      expect(named.part(name).attributes('id')).toBe('custom')
      expect(named.part(name).attributes('aria-label')).toBe('Custom')
      expect(named.part(name).attributes('aria-valuenow')).toBeDefined()

      const labelled = mountTime(props, () => [
        h(Part as Component, { key: name, namespace: 'v0:alarm', ariaLabelledby: 'outside' }),
      ])
      await labelled.wait()

      expect(labelled.part(name).attributes('aria-labelledby')).toBe('outside')
      expect(labelled.part(name).attributes('aria-label')).toBeUndefined()
    })

    it('should pad a single digit with the zero of a locale whose digits take two code units', async () => {
      // Mathematical bold digits sit outside the basic plane, as the digits
      // of `ccp` and `ff-Adlm` do, without depending on the browser's data.
      class Bold extends LocaleAdapter {
        t (key: string): string {
          return key
        }

        ti (): undefined {
          return undefined
        }

        n (value: number): string {
          return [...String(value)].map(digit => String.fromCodePoint(0x1D7CE + Number(digit))).join('')
        }
      }

      const digits = new Bold()
      const wrapper = mount(TimePicker.Root as Component, {
        props: { modelValue: '07:15' },
        slots: {
          default: () => [
            h(TimePicker.Hour as Component, {}, { default: ({ text }: { text: string }) => text }),
            h(TimePicker.Minute as Component, {}, { default: ({ text }: { text: string }) => text }),
          ],
        },
        global: { plugins: [createLocalePlugin({ adapter: digits })] },
        attachTo: document.body,
      })
      wrappers.push(wrapper)
      await nextTick()

      expect(digits.n(7)).toHaveLength(2)
      expect(wrapper.get('[data-part="hour"]').text()).toBe(`${digits.n(0)}${digits.n(7)}`)
      expect(wrapper.get('[data-part="minute"]').text()).toBe(digits.n(15))
    })

    it('should take the order of a 12-hour hour and its meridiem from the locale catalog', async () => {
      const messages = { en: { TimePicker: { hourText: '{period} / {hour}' } } }
      const wrapper = mount(TimePicker.Root as Component, {
        props: { modelValue: '15:07', hourCycle: 'h12' },
        slots: { default: () => [h(TimePicker.Hour as Component)] },
        global: { plugins: [createLocalePlugin({ default: 'en', messages })] },
        attachTo: document.body,
      })
      wrappers.push(wrapper)
      await nextTick()

      expect(wrapper.get('[data-part="hour"]').attributes('aria-valuetext')).toBe('PM / 3')
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

    it('should disable a native button host natively', async () => {
      const { part, wait } = mountTime(
        { modelValue: '09:00', disabled: true },
        () => [h(TimePicker.Hour as Component, { as: 'button', key: 'hour' })],
      )
      await wait()

      expect((part('hour').element as HTMLButtonElement).disabled).toBe(true)
      expect(part('hour').attributes('aria-disabled')).toBeUndefined()
      expect(part('hour').attributes('data-disabled')).toBe('true')
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

  describe('a host that vets updates', () => {
    function cap (value: string | null) {
      return !isNull(value) && value > '12:00' ? '12:00' : value
    }

    function refuse (value: string | null, current: string | null) {
      return !isNull(value) && value > '12:00' ? current : value
    }

    function keep (_: string | null, current: string | null) {
      return current
    }

    it.each([
      ['rewrites', cap],
      ['refuses', refuse],
    ])('should show what the model holds when the host %s an update', async (_, accept) => {
      const { emitted, model, wrapper, part } = mountTime({ modelValue: '11:00', name: 'alarm' }, fields, true, accept)
      await answered()

      press(part('hour').element, 'ArrowUp')
      await answered()
      expect(model.value).toBe('12:00')
      expect(part('hour').attributes('aria-valuenow')).toBe('12')

      press(part('hour').element, 'ArrowUp')
      await answered()

      expect(model.value).toBe('12:00')
      expect(part('hour').attributes('aria-valuenow')).toBe('12')
      expect((wrapper.get('input[type="hidden"]').element as HTMLInputElement).value).toBe('12:00')
      expect(emitted).toEqual(['12:00', '13:00'])

      press(part('hour').element, 'ArrowDown')
      await answered()

      expect(model.value).toBe('11:00')
      expect(part('hour').attributes('aria-valuenow')).toBe('11')
      expect(emitted).toEqual(['12:00', '13:00', '11:00'])
    })

    it('should keep a half-entered time the host has no say over', async () => {
      const { model, part } = mountTime({ modelValue: '11:30' }, fields, true, refuse)
      await answered()

      press(part('minute').element, 'Delete')
      await answered()

      expect(model.value).toBeNull()
      expect(part('hour').attributes('aria-valuenow')).toBe('11')
      expect(part('minute').attributes('aria-valuenow')).toBeUndefined()
    })

    it('should widen the reported range downward for a value the host insists on', async () => {
      const { part } = mountTime({ modelValue: '13:00', hourCycle: 'h12', hourStep: 5 }, fields, true, keep)
      await answered()

      expect(part('hour').attributes('aria-valuenow')).toBe('1')
      expect(part('hour').attributes('aria-valuemin')).toBe('1')
      expect(part('hour').attributes('aria-valuemax')).toBe('8')
    })

    it('should step a value the host insists on from what the field shows', async () => {
      const { emitted, part } = mountTime({ modelValue: '04:50', minuteStep: 15 }, fields, true, keep)
      await answered()

      expect(emitted).toEqual(['04:45'])
      expect(part('minute').attributes('aria-valuenow')).toBe('50')

      press(part('minute').element, 'ArrowDown')
      expect(emitted).toEqual(['04:45', '04:45'])

      await answered()

      expect(emitted).toEqual(['04:45', '04:45'])
      expect(part('minute').attributes('aria-valuenow')).toBe('50')
    })

    it('should emit once more, and no further, when the host replaces a write with a value off the grid', async () => {
      function limit (value: string | null) {
        return !isNull(value) && value > '12:08' ? '12:08' : value
      }

      const { emitted, model, wrapper, part } = mountTime({ modelValue: '10:00', minuteStep: 15, name: 'alarm' }, fields, true, limit)
      await answered()

      press(part('hour').element, 'End')
      await answered()

      expect(emitted).toEqual(['23:00', '12:15'])
      expect(model.value).toBe('12:08')
      expect(part('hour').attributes('aria-valuenow')).toBe('12')
      expect(part('minute').attributes('aria-valuenow')).toBe('8')
      expect((wrapper.get('input[type="hidden"]').element as HTMLInputElement).value).toBe('12:08')
    })

    it('should show a value the host insists on as given and take it up again after an option change', async () => {
      const { emitted, model, part, set } = mountTime({ modelValue: '10:50', minuteStep: 20 }, fields, true, keep)
      await answered()

      expect(emitted).toEqual(['10:40'])
      expect(model.value).toBe('10:50')
      expect(part('minute').attributes('aria-valuenow')).toBe('50')
      expect(part('minute').attributes('aria-valuemax')).toBe('50')

      set({ minuteStep: 1 })
      await answered()

      expect(emitted).toEqual(['10:40'])
      expect(part('minute').attributes('aria-valuenow')).toBe('50')
      expect(part('minute').attributes('aria-valuemax')).toBe('59')
    })

    it('should warn once about a model the host will not let go of', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { emitted, model, part } = mountTime({ modelValue: 'bogus' }, fields, true, keep)
      await answered()

      expect(emitted).toEqual([null])
      expect(model.value).toBe('bogus')
      expect(part('hour').attributes('aria-valuenow')).toBeUndefined()
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('edits close together', () => {
    it.each([
      ['a microtask', () => Promise.resolve()],
      ['a tick', () => nextTick()],
      ['a macrotask', () => new Promise<void>(resolve => setTimeout(resolve, 0))],
    ])('should keep a half-entered time when keys come %s apart', async (_, gap) => {
      const { model, part } = mountTime({ modelValue: '09:30:10', seconds: true }, fields, true)
      await answered()

      press(part('hour').element, 'ArrowUp')
      await gap()
      press(part('hour').element, 'Backspace')
      await gap()
      press(part('minute').element, 'ArrowDown')
      await answered()
      await answered()

      expect(model.value).toBeNull()
      expect(part('hour').attributes('aria-valuenow')).toBeUndefined()
      expect(part('minute').attributes('aria-valuenow')).toBe('29')
      expect(part('second').attributes('aria-valuenow')).toBe('10')

      press(part('hour').element, 'ArrowUp')
      await answered()

      expect(model.value).toBe('00:29:10')
    })
  })

  describe('mount', () => {
    it('should emit once when a top-level mount normalizes the value', async () => {
      const { emitted, model, part } = mountTime({ modelValue: '09:50', minuteStep: 15 })
      await answered()

      expect(emitted).toEqual(['09:45'])
      expect(model.value).toBe('09:45')
      expect(part('minute').attributes('aria-valuenow')).toBe('45')
    })

    it('should emit once when a mount inside a flush normalizes the value', async () => {
      const shown = shallowRef(false)
      const model = shallowRef<string | null>('09:50')
      const emitted: (string | null)[] = []

      const Host = defineComponent({
        render: () => shown.value
          ? h(TimePicker.Root as Component, {
              'modelValue': model.value,
              'minuteStep': 15,
              'onUpdate:modelValue': (value: string | null) => {
                emitted.push(value)
                model.value = value
              },
            }, { default: fields })
          : h('div'),
      })

      const wrapper = mount(Host, { attachTo: document.body })
      wrappers.push(wrapper)

      shown.value = true
      await answered()

      expect(emitted).toEqual(['09:45'])
      expect(wrapper.get('[data-part="minute"]').attributes('aria-valuenow')).toBe('45')
    })
  })

  describe('slot props', () => {
    it('should step the field from its slot', async () => {
      let step: TimePickerHourSlotProps['step'] | undefined

      const { model, wait } = mountTime({ modelValue: '09:30' }, () => [
        h(TimePicker.Hour as Component, { key: 'hour' }, {
          default: (props: TimePickerHourSlotProps) => {
            step = props.step
            return props.text
          },
        }),
        h(TimePicker.Minute as Component, { key: 'minute' }),
      ])
      await wait()

      step?.(-1)
      await wait()

      expect(model.value).toBe('08:30')
    })

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

    it('should give each part the text it shows', async () => {
      function shown (Part: unknown, key: string) {
        return h(Part as Component, { key }, { default: ({ text }: { text: string }) => text })
      }

      const { part, wait } = mountTime({ modelValue: '15:05:09', hourCycle: 'h12', seconds: true }, () => [
        shown(TimePicker.Hour, 'hour'),
        shown(TimePicker.Minute, 'minute'),
        shown(TimePicker.Second, 'second'),
        shown(TimePicker.Period, 'period'),
      ])
      await wait()

      expect(part('hour').text()).toBe('03')
      expect(part('minute').text()).toBe('05')
      expect(part('second').text()).toBe('09')
      expect(part('period').text()).toBe('PM')

      press(part('minute').element, 'Delete')
      press(part('period').element, 'ArrowDown')
      await wait()

      expect(part('minute').text()).toBe('')
      expect(part('hour').text()).toBe('03')
      expect(part('period').text()).toBe('AM')
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

    it('should submit what the fields show, not the raw model', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      let root: TimePickerRootSlotProps | undefined
      const { model, wrapper, part, wait } = mountTime({ modelValue: 'bogus', name: 'alarm', readonly: true }, props => {
        root = props
        return fields()
      })
      await wait()

      expect(model.value).toBe('bogus')
      expect(part('hour').attributes('aria-valuenow')).toBeUndefined()
      expect(root!.value).toBeNull()
      expect((wrapper.get('input[type="hidden"]').element as HTMLInputElement).value).toBe('')
      expect(new FormData(wrapper.element as HTMLFormElement).get('alarm')).toBe('')
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should leave a disabled picker out of the form data', async () => {
      const { wrapper, wait } = mountTime({ modelValue: '09:30', name: 'alarm', disabled: true })
      await wait()

      expect((wrapper.get('input[type="hidden"]').element as HTMLInputElement).disabled).toBe(true)
      expect(new FormData(wrapper.element as HTMLFormElement).has('alarm')).toBe(false)
    })

    it('should associate the hidden input with the form named by the form prop', async () => {
      const outside = document.createElement('form')
      outside.id = 'outside'
      document.body.append(outside)

      const { wrapper, wait } = mountTime({ modelValue: '09:30', name: 'alarm', form: 'outside' })
      await wait()

      const input = wrapper.get('input[type="hidden"]')
      expect(input.attributes('form')).toBe('outside')
      expect(input.attributes('inert')).toBeUndefined()
      expect(new FormData(outside).get('alarm')).toBe('09:30')
      expect(new FormData(wrapper.element as HTMLFormElement).has('alarm')).toBe(false)

      outside.remove()
    })

    it('should render no hidden input without a name', async () => {
      const { wrapper, wait } = mountTime({ modelValue: '09:30' })
      await wait()

      expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)
    })
  })
  describe('validation', () => {
    function described (): VNode[] {
      return [
        ...fields(),
        h(TimePicker.Description as Component, { key: 'description' }, () => 'Opening hours'),
        h(TimePicker.Error as Component, { key: 'error' }, {
          default: ({ errors }: { errors: string[] }) => errors.join(', '),
        }),
      ]
    }

    function outside (): HTMLButtonElement {
      const button = document.createElement('button')
      document.body.append(button)
      return button
    }

    it('should point the group and every field at the description', async () => {
      const { wrapper, part, wait } = mountTime({ ariaDescribedby: 'hint' }, described)
      await wait()

      const group = wrapper.get('[role="group"]')
      const id = `${group.attributes('id')}-description`

      expect(wrapper.find(`[id="${id}"]`).text()).toBe('Opening hours')
      expect(group.attributes('aria-describedby')).toBe(`hint ${id}`)
      expect(part('hour').attributes('aria-describedby')).toBe(id)
      expect(part('minute').attributes('aria-describedby')).toBe(id)
    })

    it('should mark the fields required and leave them unvalidated at first', async () => {
      const { wrapper, part, wait } = mountTime({ required: true }, described)
      await wait()

      expect(part('hour').attributes('aria-required')).toBe('true')
      expect(part('minute').attributes('aria-required')).toBe('true')
      expect(part('hour').attributes('aria-invalid')).toBeUndefined()
      expect(part('hour').attributes('aria-errormessage')).toBeUndefined()
      expect(wrapper.get('[role="group"]').attributes('data-state')).toBe('pristine')
    })

    it('should not treat focus moving between two fields as a blur', async () => {
      const { wrapper, part, wait } = mountTime({ required: true }, described)
      const button = outside()
      await wait()

      const group = wrapper.get('[role="group"]')
      ;(part('hour').element as HTMLElement).focus()
      await wait()
      expect(group.attributes('data-focused')).toBe('true')

      // No `focusin` follows, so only the handler's own reading of where
      // focus went keeps the picker focused.
      part('hour').element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: part('minute').element }))
      await flushPromises()
      expect(group.attributes('data-focused')).toBe('true')
      expect(group.attributes('data-state')).toBe('pristine')
      expect(part('minute').attributes('aria-invalid')).toBeUndefined()

      part('hour').element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: button }))
      await flushPromises()
      expect(group.attributes('data-focused')).toBeUndefined()
      expect(group.attributes('data-state')).toBe('invalid')

      button.remove()
    })

    it('should treat focus that leaves the page as a blur', async () => {
      const { wrapper, part, wait } = mountTime({ required: true }, described)
      await wait()

      ;(part('hour').element as HTMLElement).focus()
      await wait()
      part('hour').element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
      await flushPromises()

      expect(wrapper.get('[role="group"]').attributes('data-state')).toBe('invalid')
    })

    it('should not validate a disabled picker when a field is focused and blurred', async () => {
      const { wrapper, part, wait } = mountTime({ required: true, disabled: true }, described)
      const button = outside()
      await wait()

      const hour = part('hour').element as HTMLElement
      hour.focus()
      await wait()
      expect(document.activeElement).toBe(hour)
      expect(wrapper.get('[role="group"]').attributes('data-focused')).toBeUndefined()

      button.focus()
      await flushPromises()

      expect(wrapper.get('[role="group"]').attributes('data-state')).toBe('pristine')
      expect(part('hour').attributes('aria-invalid')).toBeUndefined()

      button.remove()
    })

    it('should validate a readonly picker when focus leaves it', async () => {
      const { wrapper, part, wait } = mountTime({ required: true, readonly: true }, described)
      const button = outside()
      await wait()

      ;(part('hour').element as HTMLElement).focus()
      await wait()
      button.focus()
      await flushPromises()

      expect(wrapper.get('[role="group"]').attributes('data-state')).toBe('invalid')

      button.remove()
    })

    it.each([
      ['a controlled', { modelValue: '09:07' }],
      ['an uncontrolled', {}],
    ] as const)('should not validate on input when %s picker normalizes its initial value', async (_, model) => {
      const rules = [(value: unknown) => (value !== '09:00' && value !== null) || 'Not this']
      const { wrapper, wait } = mountTime({ ...model, minuteStep: 15, validateOn: 'input', rules }, described)
      await wait()
      await flushPromises()
      await flushPromises()

      expect(wrapper.get('[role="group"]').attributes('data-state')).toBe('pristine')
    })

    it('should validate on input for an edit, including one back to the initial value', async () => {
      const rules = [(value: unknown) => value !== '09:00' || 'Not nine']
      const { model, wrapper, part } = mountTime({ modelValue: '09:07', minuteStep: 15, validateOn: 'input', rules }, described)
      await flushPromises()
      const group = wrapper.get('[role="group"]')
      expect(model.value).toBe('09:00')

      await part('minute').trigger('keydown', { key: 'ArrowUp' })
      await flushPromises()
      expect(group.attributes('data-state')).toBe('valid')

      await part('minute').trigger('keydown', { key: 'ArrowDown' })
      await flushPromises()
      expect(model.value).toBe('09:00')
      expect(group.attributes('data-state')).toBe('invalid')
    })

    it.each([['input'], ['blur eager']] as const)('should clear an error when a valid value comes in from outside under validateOn %s', async validateOn => {
      const rules = [(value: unknown) => value !== '10:00' || 'No ten']
      const { model, wrapper, part } = mountTime({ modelValue: '09:00', validateOn, rules }, described)
      const button = outside()
      await flushPromises()
      const group = wrapper.get('[role="group"]')

      ;(part('hour').element as HTMLElement).focus()
      await part('hour').trigger('keydown', { key: 'ArrowUp' })
      button.focus()
      await flushPromises()
      expect(model.value).toBe('10:00')
      expect(group.attributes('data-state')).toBe('invalid')

      model.value = '11:00'
      await flushPromises()
      await flushPromises()

      expect(group.attributes('data-state')).toBe('valid')
      expect(wrapper.get('[aria-live="polite"]').text()).toBe('')

      button.remove()
    })

    it.each([
      ['a controlled', (value: string | null) => value],
      ['an owner that keeps the raw value for a', (_: string | null, current: string | null) => current],
    ] as const)('should validate a value from outside once, in its normalized form, for %s picker', async (name, accept) => {
      const seen: unknown[] = []
      const rules = [(value: unknown) => {
        seen.push(value)
        return true
      }]
      const { model, wrapper } = mountTime({ modelValue: '09:00', minuteStep: 15, validateOn: 'input', rules }, described, undefined, accept)
      await flushPromises()
      expect(seen).toEqual([])

      model.value = '10:07'
      await flushPromises()
      await flushPromises()

      expect(seen).toEqual([name === 'a controlled' ? '10:00' : '10:07'])
      expect(wrapper.get('[role="group"]').attributes('data-state')).toBe('valid')
    })

    it('should not validate on input when an option change normalizes the value', async () => {
      const rules = [(value: unknown) => value !== '09:00' || 'Not nine']
      const { model, wrapper, set } = mountTime({ modelValue: '09:05', minuteStep: 5, validateOn: 'input', rules }, described)
      await flushPromises()

      set({ minuteStep: 15 })
      await flushPromises()
      await flushPromises()

      expect(model.value).toBe('09:00')
      expect(wrapper.get('[role="group"]').attributes('data-state')).toBe('pristine')
    })

    it('should validate again when a step change moves a validated value', async () => {
      const rules = [(value: unknown) => value !== '09:15' || 'Not a quarter past']
      const { model, wrapper, part, set } = mountTime({ modelValue: '09:05', minuteStep: 5, validateOn: 'input', rules }, described)
      await flushPromises()
      const group = wrapper.get('[role="group"]')

      await part('minute').trigger('keydown', { key: 'ArrowUp' })
      await flushPromises()
      expect(model.value).toBe('09:10')
      expect(group.attributes('data-state')).toBe('valid')

      set({ minuteStep: 15 })
      await flushPromises()
      await flushPromises()

      expect(model.value).toBe('09:15')
      expect(group.attributes('data-state')).toBe('invalid')
    })

    it('should clear an error under validateOn blur eager when a step change moves the value off it', async () => {
      const rules = [(value: unknown) => value !== '09:10' || 'Not ten past']
      const { model, wrapper, part, set } = mountTime({ modelValue: '09:05', minuteStep: 5, validateOn: 'blur eager', rules }, described)
      const button = outside()
      await flushPromises()
      const group = wrapper.get('[role="group"]')

      ;(part('minute').element as HTMLElement).focus()
      await part('minute').trigger('keydown', { key: 'ArrowUp' })
      button.focus()
      await flushPromises()
      expect(model.value).toBe('09:10')
      expect(group.attributes('data-state')).toBe('invalid')

      set({ minuteStep: 15 })
      await flushPromises()
      await flushPromises()

      expect(model.value).toBe('09:15')
      expect(group.attributes('data-state')).toBe('valid')

      button.remove()
    })

    it('should validate again when a bound moves a validated value', async () => {
      const rules = [(value: unknown) => value !== '11:00' || 'Must end after the start']
      const { model, wrapper, part, set } = mountTime({ modelValue: '10:00', validateOn: 'input', rules }, described)
      await flushPromises()
      const group = wrapper.get('[role="group"]')

      await part('minute').trigger('keydown', { key: 'ArrowUp' })
      await flushPromises()
      expect(model.value).toBe('10:01')
      expect(group.attributes('data-state')).toBe('valid')

      set({ min: '11:00' })
      await flushPromises()
      await flushPromises()

      expect(model.value).toBe('11:00')
      expect(group.attributes('data-state')).toBe('invalid')
    })

    it('should validate again when release normalizes a value validated while disabled', async () => {
      const rules = [(value: unknown) => value !== '09:00' || 'Not nine']
      const { model, wrapper, set } = mountTime({ modelValue: '10:00', minuteStep: 15, disabled: true, validateOn: 'input', rules }, described)
      await flushPromises()
      const group = wrapper.get('[role="group"]')

      model.value = '09:07'
      await flushPromises()
      expect(group.attributes('data-state')).toBe('valid')

      set({ disabled: false })
      await flushPromises()
      await flushPromises()

      expect(model.value).toBe('09:00')
      expect(group.attributes('data-state')).toBe('invalid')
    })

    it('should stay unvalidated after a reset under validateOn input', async () => {
      let slot!: TimePickerRootSlotProps
      const rules = [(value: unknown) => value === '09:00' || 'Only nine']
      const { model, part } = mountTime({ modelValue: '09:07', minuteStep: 15, validateOn: 'input', rules }, root => {
        slot = root
        return fields()
      })
      await flushPromises()

      await part('hour').trigger('keydown', { key: 'ArrowUp' })
      await flushPromises()
      expect(slot.isValid).toBe(false)

      slot.reset()
      await flushPromises()
      await flushPromises()

      expect(model.value).toBe('09:00')
      expect(slot.isValid).toBeNull()
    })

    it('should count focus taken while disabled once the picker is enabled', async () => {
      const { wrapper, part, set, wait } = mountTime({ required: true, disabled: true }, described)
      const button = outside()
      await wait()
      const group = wrapper.get('[role="group"]')

      ;(part('hour').element as HTMLElement).focus()
      await flushPromises()
      expect(group.attributes('data-focused')).toBeUndefined()

      set({ disabled: false })
      await flushPromises()
      expect(group.attributes('data-focused')).toBe('true')

      button.focus()
      await flushPromises()
      expect(group.attributes('data-state')).toBe('invalid')

      button.remove()
    })

    it('should drop the focused state, without validating, when the picker is disabled with focus inside', async () => {
      const { wrapper, part, set, wait } = mountTime({ required: true }, described)
      const button = outside()
      await wait()
      const group = wrapper.get('[role="group"]')

      ;(part('hour').element as HTMLElement).focus()
      await flushPromises()
      expect(group.attributes('data-focused')).toBe('true')

      set({ disabled: true })
      await flushPromises()
      expect(group.attributes('data-focused')).toBeUndefined()
      expect(group.attributes('data-state')).toBe('pristine')

      button.focus()
      await flushPromises()
      expect(group.attributes('data-state')).toBe('pristine')

      button.remove()
    })

    it.each([['disabled'], ['readonly']] as const)('should not emit when a %s picker resets through the slot', async flag => {
      let slot!: TimePickerRootSlotProps
      const { model, emitted, part, wait } = mountTime({ modelValue: '09:00', [flag]: true, required: true }, root => {
        slot = root
        return fields()
      })
      await wait()

      model.value = '10:00'
      await flushPromises()
      await slot.validate()
      emitted.length = 0

      slot.reset()
      await flushPromises()

      expect(emitted).toEqual([])
      expect(model.value).toBe('10:00')
      expect(part('hour').attributes('aria-valuenow')).toBe('10')
      expect(slot.isValid).toBeNull()
    })

    it('should wire the error to every field once focus leaves an invalid picker', async () => {
      const { wrapper, part, wait } = mountTime({ required: true }, described)
      const button = outside()
      await wait()

      ;(part('hour').element as HTMLElement).focus()
      await part('hour').trigger('keydown', { key: 'ArrowUp' })
      button.focus()
      await flushPromises()

      const id = `${wrapper.get('[role="group"]').attributes('id')}-error`
      const error = wrapper.get(`[id="${id}"]`)

      expect(error.attributes('aria-live')).toBe('polite')
      expect(error.attributes('data-state')).toBe('visible')
      expect(error.text()).not.toBe('')
      for (const name of ['hour', 'minute']) {
        expect(part(name).attributes('aria-invalid')).toBe('true')
        expect(part(name).attributes('aria-errormessage')).toBe(id)
      }

      ;(part('minute').element as HTMLElement).focus()
      await part('minute').trigger('keydown', { key: 'ArrowUp' })
      button.focus()
      await flushPromises()

      expect(part('hour').attributes('aria-invalid')).toBeUndefined()
      expect(part('hour').attributes('aria-errormessage')).toBeUndefined()
      expect(error.attributes('data-state')).toBe('hidden')
      expect(wrapper.get('[role="group"]').attributes('data-state')).toBe('valid')

      button.remove()
    })

    it('should not validate on blur when validateOn is submit', async () => {
      const { wrapper, part, wait } = mountTime({ required: true, validateOn: 'submit' }, described)
      const button = outside()
      await wait()

      ;(part('hour').element as HTMLElement).focus()
      button.focus()
      await flushPromises()

      expect(wrapper.get('[role="group"]').attributes('data-state')).toBe('pristine')

      button.remove()
    })

    it('should force the invalid state and show the messages given as props', async () => {
      const { wrapper, part, set, wait } = mountTime({ modelValue: '09:30' }, described)
      await wait()
      expect(part('hour').attributes('aria-invalid')).toBeUndefined()

      set({ error: true, errorMessages: ['Taken'] })
      await wait()

      expect(part('hour').attributes('aria-invalid')).toBe('true')
      expect(wrapper.get('[aria-live="polite"]').text()).toBe('Taken')
    })

    it('should reset to the initial value through the slot', async () => {
      let slot!: TimePickerRootSlotProps
      const { model, part, wait } = mountTime({ modelValue: '09:07', minuteStep: 15, required: true }, root => {
        slot = root
        return fields()
      })
      await wait()
      await wait()
      expect(model.value).toBe('09:00')
      expect(slot.isPristine).toBe(true)

      await part('hour').trigger('keydown', { key: 'ArrowUp' })
      await wait()
      expect(model.value).toBe('10:00')
      expect(slot.isPristine).toBe(false)

      slot.reset()
      await flushPromises()

      expect(model.value).toBe('09:00')
      expect(slot.isPristine).toBe(true)
      expect(slot.isValid).toBeNull()
    })

    it('should fail a form submit while a field is empty and pass once the time is complete', async () => {
      const results: boolean[] = []
      const wrapper = mount(Form as Component, {
        attachTo: document.body,
        props: { onSubmit: ({ valid }: { valid: boolean }) => results.push(valid) },
        slots: {
          default: () => h(TimePicker.Root as Component, { required: true }, { default: fields }),
        },
      })
      wrappers.push(wrapper)

      async function submit () {
        wrapper.element.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
        await flushPromises()
      }

      await wrapper.get('[data-part="hour"]').trigger('keydown', { key: 'ArrowUp' })
      await submit()

      expect(results).toEqual([false])
      expect(wrapper.get('[data-part="hour"]').attributes('aria-invalid')).toBe('true')

      await wrapper.get('[data-part="minute"]').trigger('keydown', { key: 'ArrowUp' })
      await submit()

      expect(results).toEqual([false, true])
      expect(wrapper.get('[data-part="hour"]').attributes('aria-invalid')).toBeUndefined()

      wrapper.element.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }))
      await flushPromises()

      expect(wrapper.get('[role="group"]').attributes('data-state')).toBe('pristine')
    })
  })
})
