export type { QuButtonProps, QuButtonVariant } from './QuButton.vue'

/**
 * The Material Design 1 button: flat or raised, in the standard, dense and
 * persistent footer forms. Composes v0 `Button.Root` / `Button.Content`, and
 * `Button.Icon` around `QuIcon` when `icon` is set; hosts `QuRipple` for the press.
 *
 * @example
 * ```vue
 * <QuButton variant="raised">Save</QuButton>
 * <QuButton aria-label="Add" icon="add" />
 * ```
 */
export { default as QuButton } from './QuButton.vue'
