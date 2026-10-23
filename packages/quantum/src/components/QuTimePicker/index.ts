export type { QuTimePickerFormat, QuTimePickerProps } from './QuTimePicker.vue'

/**
 * The Material Design 1 time picker: a header with the hour and minute
 * segments (v0 `Toggle.Group`) and the AM / PM labels (v0 `Radio.Group`) over
 * a clock face whose numbers are a v0 `Radio.Group`. The time state is
 * Quantum's own `useClock` until v0's `createTimePicker` leaves draft.
 * Host it in `QuDialog variant="confirmation"`, which supplies CANCEL and OK.
 *
 * @example
 * ```vue
 * <QuTimePicker v-model="time" />
 * <QuTimePicker v-model="time" format="24" landscape />
 * ```
 */
export { default as QuTimePicker } from './QuTimePicker.vue'
