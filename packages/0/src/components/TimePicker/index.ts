export { default as TimePickerHiddenInput } from './TimePickerHiddenInput.vue'
export { default as TimePickerHour } from './TimePickerHour.vue'
export { default as TimePickerMinute } from './TimePickerMinute.vue'
export { default as TimePickerPeriod } from './TimePickerPeriod.vue'
export { provideTimePickerRoot, useTimePickerRoot } from './TimePickerRoot.vue'
export { default as TimePickerRoot } from './TimePickerRoot.vue'
export { default as TimePickerSecond } from './TimePickerSecond.vue'

export type { TimePickerHiddenInputProps } from './TimePickerHiddenInput.vue'
export type { TimePickerHourProps, TimePickerHourSlotProps } from './TimePickerHour.vue'
export type { TimePickerMinuteProps, TimePickerMinuteSlotProps } from './TimePickerMinute.vue'
export type { TimePickerPeriodProps, TimePickerPeriodSlotProps } from './TimePickerPeriod.vue'
export type { TimePickerRootContext, TimePickerRootProps, TimePickerRootSlotProps } from './TimePickerRoot.vue'
export type { TimePickerSecondProps, TimePickerSecondSlotProps } from './TimePickerSecond.vue'

// Context
import HiddenInput from './TimePickerHiddenInput.vue'
import Hour from './TimePickerHour.vue'
import Minute from './TimePickerMinute.vue'
import Period from './TimePickerPeriod.vue'
import Root from './TimePickerRoot.vue'
import Second from './TimePickerSecond.vue'

/**
 * Segmented time control.
 *
 * Hour, minute, and optional second are spinbuttons. The value is a
 * 24-hour `HH:mm` string, or `HH:mm:ss` when seconds are on, and stays
 * null until every enabled field is set. AM/PM renders only in 12-hour mode.
 *
 * @see https://0.vuetifyjs.com/components/forms/time-picker
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { TimePicker } from '@vuetify/v0'
 *   import { shallowRef } from 'vue'
 *
 *   const value = shallowRef<string | null>(null)
 * </script>
 *
 * <template>
 *   <TimePicker.Root v-slot="{ hour, minute }" v-model="value">
 *     <TimePicker.Hour>{{ hour }}</TimePicker.Hour>
 *     <TimePicker.Minute>{{ minute }}</TimePicker.Minute>
 *   </TimePicker.Root>
 * </template>
 * ```
 */
export const TimePicker = {
  /** Group that owns the time value. @example `<TimePicker.Root v-model="value" />` */
  Root,
  /** Hour spinbutton. Arrow keys step it. @example `<TimePicker.Hour />` */
  Hour,
  /** Minute spinbutton. Arrow keys step it. @example `<TimePicker.Minute />` */
  Minute,
  /** Second spinbutton. Renders only when seconds are on. @example `<TimePicker.Second />` */
  Second,
  /** Meridiem spinbutton. Renders only in 12-hour mode. @example `<TimePicker.Period />` */
  Period,
  /** Hidden input rendered by Root when `name` is set. @example `<TimePicker.Root name="start" />` */
  HiddenInput,
}
