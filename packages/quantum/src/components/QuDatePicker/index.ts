export type { QuDatePickerProps } from './QuDatePicker.vue'

/**
 * The Material Design 1 date picker: a header in the primary colour, a month
 * grid and a year list, in portrait or landscape. Built on Quantum's
 * `createDatePickerCore` with v0 `useRovingFocus` for the grid and
 * `Button.Root` for every day. Inside `QuDialog variant="confirmation"` it
 * holds its date in the dialog until OK.
 *
 * @example
 * ```vue
 * <QuDatePicker v-model="date" />
 * ```
 */
export { default as QuDatePicker } from './QuDatePicker.vue'
