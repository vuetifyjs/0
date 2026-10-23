export type { Md1DatePickerProps } from './Md1DatePicker.vue'

/**
 * The Material Design 1 date picker: a header in the primary colour, a month
 * grid and a year list, in portrait or landscape. Built on MD1's
 * `createDatePickerCore` with v0 `useRovingFocus` for the grid and
 * `Button.Root` for every day. Inside `Md1Dialog variant="confirmation"` it
 * holds its date in the dialog until OK.
 *
 * @example
 * ```vue
 * <Md1DatePicker v-model="date" />
 * ```
 */
export { default as Md1DatePicker } from './Md1DatePicker.vue'
