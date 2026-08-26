export type { EmStepProps } from './EmStep.vue'
export type { EmStepItemProps } from './EmStepItem.vue'
export { default as EmStepItem } from './EmStepItem.vue'

// Context
import Root from './EmStep.vue'
import Item from './EmStepItem.vue'

/**
 * Stepper. Owns the active step and the completed/upcoming states its items read.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmStepItem`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmStep } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmStep v-model="step">
 *     <EmStep.Item />
 *   </EmStep>
 * </template>
 * ```
 */
export const EmStep = Object.assign(Root, {
  /** One step in the sequence. */
  Item,
})
