export type { Md1RadioProps } from './Md1Radio.vue'
export type { Md1RadioGroupProps } from './Md1RadioGroup.vue'
export { default as Md1RadioGroup } from './Md1RadioGroup.vue'

// Context
import Root from './Md1Radio.vue'
import Group from './Md1RadioGroup.vue'

/**
 * The Material Design 1 radio button: a 20 dp ring with a 10 dp dot in the
 * accent colour when on. Composes v0 `Radio.Root` / `Radio.Indicator` inside a
 * native `<label>`; hosts an unbounded `Md1Ripple` for the touch reaction. A
 * radio must sit inside `Md1Radio.Group` (v0 `Radio.Group`), which owns the
 * model, the shared `name` and the arrow-key navigation.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat name (`Md1RadioGroup`) remains exported and valid.
 *
 * @example
 * ```vue
 * <Md1Radio.Group v-model="size" aria-label="Size">
 *   <Md1Radio label="Small" value="s" />
 *
 *   <Md1Radio label="Large" value="l" />
 * </Md1Radio.Group>
 * ```
 */
export const Md1Radio = Object.assign(Root, {
  /** The radiogroup that owns the selection; every `Md1Radio` sits inside one. */
  Group,
})
