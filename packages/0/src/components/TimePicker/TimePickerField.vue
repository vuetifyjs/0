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
  import type { TimePart, TimePeriod } from '#v0/composables/createTimePicker'

  export interface TimePickerFieldProps extends AtomProps {
    /** Which segment this spinbutton edits. */
    part: TimePart
    /** Namespace for connecting to TimePicker.Root. */
    namespace?: string
  }

  export interface TimePickerFieldSlotProps {
    /** Visible digits, or the meridiem label. Empty while the field is unset. */
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
      'aria-label': string
      'aria-disabled': boolean | undefined
      'aria-readonly': true | undefined
      'aria-valuenow': number | undefined
      'aria-valuemin': number
      'aria-valuemax': number
      'aria-valuetext': string | undefined
      'data-part': TimePart
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
  } = defineProps<TimePickerFieldProps>()

  const time = useTimePickerRoot(namespace)
  const locale = useLocale()
  const atomRef = useTemplateRef<AtomExpose>('atom')

  const isShown = toRef(() => {
    if (part === 'second') return time.seconds.value
    if (part === 'period') return time.hourCycle.value === 'h12'
    return true
  })

  function bounds (): { min: number, max: number } {
    return part === 'period' ? { min: 0, max: 1 } : time.grid(part)
  }

  function current (): number | null {
    if (part === 'hour') return time.hour.value
    if (part === 'minute') return time.minute.value
    if (part === 'second') return time.second.value
    if (isNull(time.period.value)) return null
    return time.period.value === 'pm' ? 1 : 0
  }

  function fieldLabel (): string {
    if (part === 'hour') return locale.ti('TimePicker.hour') ?? 'Hour'
    if (part === 'minute') return locale.ti('TimePicker.minute') ?? 'Minute'
    if (part === 'second') return locale.ti('TimePicker.second') ?? 'Second'
    return locale.ti('TimePicker.period') ?? 'AM/PM'
  }

  function fieldText (value: number | null): string {
    if (part === 'period') {
      if (time.period.value === 'pm') return locale.ti('TimePicker.pm') ?? 'PM'
      if (time.period.value === 'am') return locale.ti('TimePicker.am') ?? 'AM'
      return ''
    }
    if (isNull(value)) return ''
    return String(value).padStart(2, '0')
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
    const text = fieldText(now)
    const { min, max } = bounds()
    const button = as === 'button'
    const blocked = time.isDisabled.value

    return {
      text,
      value: part === 'period' ? time.period.value : now,
      isDisabled: blocked,
      isReadonly: time.isReadonly.value,
      attrs: {
        'id': `${time.id}-${part}`,
        'role': 'spinbutton',
        'tabindex': blocked ? -1 : 0,
        'type': button ? 'button' : undefined,
        'aria-label': fieldLabel(),
        'aria-disabled': button ? undefined : blocked,
        'aria-readonly': time.isReadonly.value || undefined,
        'aria-valuenow': isNull(now) ? undefined : now,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuetext': text === '' ? undefined : text,
        'data-part': part,
        'data-disabled': blocked || undefined,
        'data-readonly': time.isReadonly.value || undefined,
        'disabled': button && blocked ? true : undefined,
        onKeydown,
      },
    }
  })

  defineExpose<AtomExpose>({
    get element () {
      return (atomRef.value?.element ?? null) as AtomExpose['element']
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
