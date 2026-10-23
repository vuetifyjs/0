export type { Md1TimePickerFormat, Md1TimePickerProps } from './Md1TimePicker.vue'

/**
 * The Material Design 1 time picker: a header with the hour and minute
 * segments (v0 `Toggle.Group`) and the AM / PM labels (v0 `Radio.Group`) over
 * a clock face whose numbers are a v0 `Radio.Group`. The time state is
 * MD1's own `useClock` until v0's `createTimePicker` leaves draft.
 * Host it in `Md1Dialog variant="confirmation"`, which supplies CANCEL and OK.
 *
 * @example
 * ```vue
 * <Md1TimePicker v-model="time" />
 * <Md1TimePicker v-model="time" format="24" landscape />
 * ```
 */
export { default as Md1TimePicker } from './Md1TimePicker.vue'
