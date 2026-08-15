export type { EmTextareaProps } from './EmTextarea.vue'

/**
 * Textarea. Composes v0 `Input.Root` / `Input.Control` (as="textarea") /
 * `Input.Description` / `Input.Error`. Labels and help text are props only —
 * no named slots.
 *
 * @example
 * ```vue
 * <EmTextarea
 *   v-model="message"
 *   label="Message"
 *   description="Include order details if relevant."
 *   placeholder="Your message..."
 *   :rows="4"
 * />
 * ```
 */
export { default as EmTextarea } from './EmTextarea.vue'
