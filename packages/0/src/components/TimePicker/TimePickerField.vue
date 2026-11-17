/**
 * @module TimePickerField
 *
 * @see https://0.vuetifyjs.com/components/forms/time-picker
 *
 * @remarks
 * Shared spinbutton behind Hour, Minute, Second, and Period. Reads its
 * segment from the TimePicker.Root context, emits the spinbutton ARIA
 * for the values that segment can show, and maps keys onto the context:
 * arrows and Page keys step, Home and End jump to the ends of the grid,
 * Backspace and Delete clear. Not exported; use the named parts.
 *
 * @internal
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTimePickerRoot } from './TimePickerRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { isNull } from '#v0/utilities'
  import { mergeProps, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { TimePart, TimePeriod, TimeUnit } from '#v0/composables/createTimePicker'

  export interface TimePickerFieldProps extends AtomProps {
    /** Which segment this spinbutton edits. */
    part: TimePart
    /** Namespace for connecting to TimePicker.Root. */
    namespace?: string
    /** Id of the spinbutton. Defaults to the Root id plus the part name. */
    id?: string
    /** Accessible name. Falls back to the locale catalog. */
    ariaLabel?: string
    /** Id of the element that labels the spinbutton. Replaces `ariaLabel`. */
    ariaLabelledby?: string
  }

  export interface TimePickerFieldSlotProps {
    /** Visible digits, two wide and in the locale's numerals, or the meridiem label. Empty while the field is unset. */
    text: string
    /** Value of the field, or `null` while unset. The meridiem for Period. */
    value: number | TimePeriod | null
    /** Whether edits are ignored. */
    isDisabled: boolean
    /** Whether edits are ignored. */
    isReadonly: boolean
    /** Attributes for the spinbutton. */
    attrs: {
      'id': string
      'role': 'spinbutton'
      'tabindex': number
      'type': 'button' | undefined
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-disabled': boolean | undefined
      'aria-readonly': true | undefined
      'aria-required': true | undefined
      'aria-invalid': true | undefined
      'aria-describedby': string | undefined
      'aria-errormessage': string | undefined
      'aria-valuenow': number | undefined
      'aria-valuemin': number
      'aria-valuemax': number
      'aria-valuetext': string | undefined
      'data-part': TimePart
      'data-state': 'empty' | 'filled'
      'data-disabled': true | undefined
      'data-readonly': true | undefined
      'disabled': true | undefined
      'onKeydown': (event: KeyboardEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TimePickerField', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: TimePickerFieldSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:time-picker',
    part,
    id,
    ariaLabel,
    ariaLabelledby,
  } = defineProps<TimePickerFieldProps>()

  const time = useTimePickerRoot(namespace)
  const locale = useLocale()
  const atomRef = useTemplateRef<AtomExpose>('atom')

  const isShown = toRef(() => {
    if (part === 'second') return time.seconds.value
    if (part === 'period') return time.hourCycle.value === 'h12'
    return true
  })

  // A blocked picker shows the value as given, which may sit off the step
  // grid, so the range it reports is the whole field.
  function reach (unit: TimeUnit): { min: number, max: number } {
    if (!time.isDisabled.value && !time.isReadonly.value) return time.grid(unit)
    if (unit !== 'hour') return { min: 0, max: 59 }
    return time.hourCycle.value === 'h12' ? { min: 1, max: 12 } : { min: 0, max: 23 }
  }

  // The shown value can sit off the grid without the picker being blocked:
  // a range with no on-grid time, or a value the model insisted on. The
  // reported range always contains it.
  function bounds (now: number | null): { min: number, max: number } {
    if (part === 'period') return { min: 0, max: 1 }
    const { min, max } = reach(part)
    return isNull(now) ? { min, max } : { min: Math.min(min, now), max: Math.max(max, now) }
  }

  function current (): number | null {
    if (part === 'hour') return time.hour.value
    if (part === 'minute') return time.minute.value
    if (part === 'second') return time.second.value
    if (isNull(time.period.value)) return null
    return time.period.value === 'pm' ? 1 : 0
  }

  function label (): string {
    if (part === 'hour') return locale.ti('TimePicker.hour') ?? 'Hour'
    if (part === 'minute') return locale.ti('TimePicker.minute') ?? 'Minute'
    if (part === 'second') return locale.ti('TimePicker.second') ?? 'Second'
    return locale.ti('TimePicker.period') ?? 'AM/PM'
  }

  function meridiem (): string {
    if (time.period.value === 'pm') return locale.ti('TimePicker.pm') ?? 'PM'
    if (time.period.value === 'am') return locale.ti('TimePicker.am') ?? 'AM'
    return ''
  }

  // Two digits in the locale's own numerals, so the screen and the spoken
  // text agree. The value the picker stores stays in Latin digits.
  function text (now: number | null): string {
    if (part === 'period') return meridiem()
    return isNull(now) ? '' : locale.n(now).padStart(2, locale.n(0))
  }

  // Only where the number alone does not say it: the period reads as its
  // label, and a 12-hour hour carries its meridiem.
  function spoken (now: number | null): string | undefined {
    if (isNull(now)) return undefined
    if (part === 'period') return meridiem()
    if (part !== 'hour' || time.hourCycle.value !== 'h12') return undefined

    const hour = locale.n(now)
    const period = meridiem()
    return locale.ti('TimePicker.hourText', { hour, period }) ?? `${hour} ${period}`
  }

  // About two hours, or fifteen minutes or seconds, in whole intervals.
  function page (): number {
    if (part === 'period') return 1
    return Math.max(1, Math.round((part === 'hour' ? 2 : 15) / time.grid(part).step))
  }

  function edge (side: 'min' | 'max') {
    if (part === 'period') time.commit('period', side === 'min' ? 'am' : 'pm')
    else time.commit(part, time.grid(part)[side])
  }

  function onKeydown (event: KeyboardEvent) {
    if (time.isDisabled.value || time.isReadonly.value) return

    switch (event.key) {
      case 'ArrowUp': {
        time.step(part, 1)
        break
      }
      case 'ArrowDown': {
        time.step(part, -1)
        break
      }
      case 'PageUp': {
        time.step(part, page())
        break
      }
      case 'PageDown': {
        time.step(part, -page())
        break
      }
      case 'Home': {
        edge('min')
        break
      }
      case 'End': {
        edge('max')
        break
      }
      case 'Backspace':
      case 'Delete': {
        if (part === 'period') return
        time.commit(part, null)
        break
      }
      default: {
        return
      }
    }

    event.preventDefault()
  }

  const slotProps = toRef((): TimePickerFieldSlotProps => {
    const now = current()
    const { min, max } = bounds(now)
    const button = as === 'button'
    const blocked = time.isDisabled.value
    const input = time.input

    return {
      text: text(now),
      value: part === 'period' ? time.period.value : now,
      isDisabled: blocked,
      isReadonly: time.isReadonly.value,
      attrs: {
        'id': id ?? `${time.id}-${part}`,
        'role': 'spinbutton',
        'tabindex': blocked ? -1 : 0,
        'type': button ? 'button' : undefined,
        'aria-label': ariaLabelledby ? undefined : (ariaLabel || label()),
        'aria-labelledby': ariaLabelledby || undefined,
        'aria-disabled': button ? undefined : blocked,
        'aria-readonly': time.isReadonly.value || undefined,
        'aria-required': input.required || undefined,
        'aria-invalid': input.isValid.value === false || undefined,
        'aria-describedby': input.hasDescription.value ? input.descriptionId : undefined,
        'aria-errormessage': input.hasError.value && input.errors.value.length > 0 ? input.errorId : undefined,
        'aria-valuenow': isNull(now) ? undefined : now,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuetext': spoken(now),
        'data-part': part,
        'data-state': isNull(now) ? 'empty' : 'filled',
        'data-disabled': blocked || undefined,
        'data-readonly': time.isReadonly.value || undefined,
        'disabled': button && blocked ? true : undefined,
        onKeydown,
      },
    }
  })

  // Untyped on purpose: with `AtomExpose` as the type argument,
  // vue-component-meta reports no props, slots, or events for the file.
  defineExpose({
    get element () {
      return (atomRef.value?.element ?? null) as HTMLElement | null
    },
  })
</script>

<template>
  <Atom
    v-if="isShown"
    ref="atom"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
