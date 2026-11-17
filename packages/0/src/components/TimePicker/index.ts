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
  /**
   * Group that owns the time value.
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
  Root,
  /**
   * Hour spinbutton. Arrow, Page, Home, and End keys move it; Backspace clears it.
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
  Hour,
  /**
   * Minute spinbutton. Arrow, Page, Home, and End keys move it; Backspace clears it.
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
  Minute,
  /**
   * Second spinbutton. Renders only when seconds are on.
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
   *   <TimePicker.Root v-slot="{ hour, minute, second }" v-model="value" seconds>
   *     <TimePicker.Hour>{{ hour }}</TimePicker.Hour>
   *     <TimePicker.Minute>{{ minute }}</TimePicker.Minute>
   *     <TimePicker.Second>{{ second }}</TimePicker.Second>
   *   </TimePicker.Root>
   * </template>
   * ```
   */
  Second,
  /**
   * Meridiem spinbutton. Renders only in 12-hour mode.
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
   *   <TimePicker.Root v-slot="{ hour, minute, period }" v-model="value" hour-cycle="h12">
   *     <TimePicker.Hour>{{ hour }}</TimePicker.Hour>
   *     <TimePicker.Minute>{{ minute }}</TimePicker.Minute>
   *     <TimePicker.Period>{{ period }}</TimePicker.Period>
   *   </TimePicker.Root>
   * </template>
   * ```
   */
  Period,
  /**
   * Hidden input rendered by Root when `name` is set.
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
   *   <form>
   *     <TimePicker.Root v-slot="{ hour, minute }" v-model="value" name="start">
   *       <TimePicker.Hour>{{ hour }}</TimePicker.Hour>
   *       <TimePicker.Minute>{{ minute }}</TimePicker.Minute>
   *     </TimePicker.Root>
   *   </form>
   * </template>
   * ```
   */
  HiddenInput,
}
