export type { EmRadioProps, EmRadioSize } from './EmRadio.vue'
export type { EmRadioGroupProps } from './EmRadioGroup.vue'

/**
 * Radio group. Composes v0 `Radio.Group`.
 *
 * @example
 * ```vue
 * <EmRadioGroup v-model="size">
 *   <EmRadio value="sm">Small</EmRadio>
 *   <EmRadio value="md">Medium</EmRadio>
 * </EmRadioGroup>
 * ```
 */
export { default as EmRadioGroup } from './EmRadioGroup.vue'

// Context
import Root from './EmRadio.vue'
import Group from './EmRadioGroup.vue'

/**
 * Radio input. Reads the selection from the enclosing group.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmRadioGroup`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmRadio } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmRadio.Group v-model="size">
 *     <EmRadio value="sm" />
 *
 *     <EmRadio value="md" />
 *   </EmRadio.Group>
 * </template>
 * ```
 */
export const EmRadio = Object.assign(Root, {
  /** Wraps sibling radios and owns the selected value. */
  Group,
})
