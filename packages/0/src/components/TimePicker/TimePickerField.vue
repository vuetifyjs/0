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

  export type TimePickerPart = 'hour' | 'minute' | 'second' | 'period'

  export interface TimePickerFieldProps extends AtomProps {
    /** Which segment this spinbutton edits. */
    part: TimePickerPart
    /** Namespace for connecting to TimePicker.Root. */
    namespace?: string
  }

  export interface TimePickerFieldSlotProps {
    /** Visible digits, or the meridiem label. Empty while the field is unset. */
    text: string
    /** Numeric value of the field, or `null` while unset. */
    value: number | null
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
      'data-part': TimePickerPart
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
    if (part === 'hour') {
      return time.hourCycle.value === 'h12'
        ? { min: 1, max: 12 }
        : { min: 0, max: 23 }
    }
    if (part === 'period') return { min: 0, max: 1 }
    return { min: 0, max: 59 }
  }

  function current (): number | null {
    if (part === 'hour') return time.hour.value
    if (part === 'minute') return time.minute.value
    if (part === 'second') return time.second.value
    if (time.period.value === 'pm') return 1
    if (time.period.value === 'am') return 0
    return null
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

  function onKeydown (event: KeyboardEvent) {
    const up = event.key === 'ArrowUp'
    const down = event.key === 'ArrowDown'
    if (!up && !down) return

    event.preventDefault()
    if (time.isDisabled.value || time.isReadonly.value) return

    const direction = up ? 1 : -1
    switch (part) {
      case 'hour': {
        time.stepHour(direction)
        break
      }
      case 'minute': {
        time.stepMinute(direction)
        break
      }
      case 'second': {
        time.stepSecond(direction)
        break
      }
      default: { time.setPeriod(time.period.value === 'pm' ? 'am' : 'pm')
      }
    }
  }

  const slotProps = toRef((): TimePickerFieldSlotProps => {
    const value = current()
    const text = fieldText(value)
    const { min, max } = bounds()
    const button = as === 'button'
    const blocked = time.isDisabled.value

    return {
      text,
      value,
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
        'aria-valuenow': isNull(value) ? undefined : value,
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
