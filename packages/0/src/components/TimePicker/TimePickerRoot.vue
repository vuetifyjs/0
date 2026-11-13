<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import TimePickerHiddenInput from './TimePickerHiddenInput.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createTimePicker } from '#v0/composables/createTimePicker'
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { mergeProps, toRef, useAttrs, useId, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { TimeHourCycle, TimePeriod, TimePickerContext } from '#v0/composables/createTimePicker'
  import type { Ref } from 'vue'

  export interface TimePickerRootProps extends AtomProps {
    /** Namespace shared with the field components. */
    namespace?: string
    /** Ignore every edit, including clear. */
    disabled?: boolean
    /** Ignore every edit, including clear. */
    readonly?: boolean
    /** `h12` shows 1–12 and a meridiem. `h23` shows 0–23. @default 'h23' */
    hourCycle?: TimeHourCycle
    /** Show the second field and include seconds in the value. @default false */
    seconds?: boolean
    /** Hour snap interval. @default 1 */
    hourStep?: number
    /** Minute snap interval. @default 1 */
    minuteStep?: number
    /** Second snap interval. @default 1 */
    secondStep?: number
    /** Inclusive lower bound, `HH:mm` or `HH:mm:ss`. */
    min?: string | null
    /** Inclusive upper bound, `HH:mm` or `HH:mm:ss`. */
    max?: string | null
    /** Submit the canonical value with a form when set. */
    name?: string
    /** Id of the group element. */
    id?: string
    /** Accessible name for the group. Falls back to the locale catalog. */
    label?: string
  }

  export interface TimePickerRootSlotProps {
    /** Canonical 24-hour value, or `null` while a field is empty. */
    value: string | null
    /** Display hour. `0`–`23` in `h23`, `1`–`12` in `h12`. */
    hour: number | null
    /** Minute, `0`–`59`. */
    minute: number | null
    /** Second, or `null` when seconds are off or unset. */
    second: number | null
    /** Meridiem, or `null` in `h23`. */
    period: TimePeriod | null
    /** Resolved hour cycle. */
    hourCycle: TimeHourCycle
    /** Whether seconds are part of the value. */
    seconds: boolean
    /** Whether edits are ignored. */
    isDisabled: boolean
    /** Whether edits are ignored. */
    isReadonly: boolean
    /** Attributes for the group element. */
    attrs: {
      'id': string
      'role': 'group'
      'aria-label': string
      'aria-disabled': boolean | undefined
      'disabled': true | undefined
      'data-disabled': true | undefined
      'data-readonly': true | undefined
    }
  }

  export interface TimePickerRootContext extends TimePickerContext {
    id: string
    name: Readonly<Ref<string | undefined>>
  }

  export const [useTimePickerRoot, provideTimePickerRoot] = /* @__PURE__ */ createContext<TimePickerRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'TimePickerRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: TimePickerRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: string | null]
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:time-picker',
    disabled = false,
    readonly: _readonly = false,
    hourCycle = 'h23',
    seconds = false,
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    min = null,
    max = null,
    name,
    id = useId(),
    label,
  } = defineProps<TimePickerRootProps>()

  const model = defineModel<string | null>({ default: null })
  const locale = useLocale()

  const time = createTimePicker({
    value: model,
    hourCycle: toRef(() => hourCycle),
    seconds: toRef(() => seconds),
    hourStep: toRef(() => hourStep),
    minuteStep: toRef(() => minuteStep),
    secondStep: toRef(() => secondStep),
    min: toRef(() => min),
    max: toRef(() => max),
    disabled: toRef(() => disabled),
    readonly: toRef(() => _readonly),
  })

  const context: TimePickerRootContext = {
    ...time,
    id,
    name: toRef(() => name),
  }

  provideTimePickerRoot(namespace, context)

  const atomRef = useTemplateRef<AtomExpose>('atom')

  const slotProps = toRef((): TimePickerRootSlotProps => {
    const button = as === 'button'
    const blocked = time.isDisabled.value

    return {
      value: time.value.value,
      hour: time.hour.value,
      minute: time.minute.value,
      second: time.second.value,
      period: time.period.value,
      hourCycle: time.hourCycle.value,
      seconds: time.seconds.value,
      isDisabled: blocked,
      isReadonly: time.isReadonly.value,
      attrs: {
        id,
        'role': 'group',
        'aria-label': label || (locale.ti('TimePicker.label') ?? 'Time'),
        'aria-disabled': button ? undefined : blocked,
        'disabled': button && blocked ? true : undefined,
        'data-disabled': blocked || undefined,
        'data-readonly': time.isReadonly.value || undefined,
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
    ref="atom"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>

  <TimePickerHiddenInput v-if="name" :namespace />
</template>
