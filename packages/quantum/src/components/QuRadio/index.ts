export type { QuRadioProps } from './QuRadio.vue'
export type { QuRadioGroupProps } from './QuRadioGroup.vue'
export { default as QuRadioGroup } from './QuRadioGroup.vue'

// Context
import Root from './QuRadio.vue'
import Group from './QuRadioGroup.vue'

/**
 * The Material Design 1 radio button: a 20 dp ring with a 10 dp dot in the
 * accent colour when on. Composes v0 `Radio.Root` / `Radio.Indicator` inside a
 * native `<label>`; hosts an unbounded `QuRipple` for the touch reaction. A
 * radio must sit inside `QuRadio.Group` (v0 `Radio.Group`), which owns the
 * model, the shared `name` and the arrow-key navigation.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat name (`QuRadioGroup`) remains exported and valid.
 *
 * @example
 * ```vue
 * <QuRadio.Group v-model="size" aria-label="Size">
 *   <QuRadio label="Small" value="s" />
 *
 *   <QuRadio label="Large" value="l" />
 * </QuRadio.Group>
 * ```
 */
export const QuRadio = Object.assign(Root, {
  /** The radiogroup that owns the selection; every `QuRadio` sits inside one. */
  Group,
})
