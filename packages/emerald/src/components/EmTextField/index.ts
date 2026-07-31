export type { EmTextFieldProps } from './EmTextField.vue'

/**
 * Text field. Composes v0 `Input.Root` / `Input.Control` / `Input.Description` / `Input.Error`.
 * Labels and help text are props only — no named slots.
 *
 * @example
 * ```vue
 * <EmTextField
 *   v-model="email"
 *   label="Email"
 *   description="We never share this."
 *   placeholder="you@example.com"
 * />
 * ```
 */
export { default as EmTextField } from './EmTextField.vue'
