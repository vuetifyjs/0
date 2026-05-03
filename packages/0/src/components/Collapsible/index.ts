export { default as CollapsibleActivator } from './CollapsibleActivator.vue'
export { default as CollapsibleContent } from './CollapsibleContent.vue'
export { default as CollapsibleCue } from './CollapsibleCue.vue'
export { default as CollapsibleRoot } from './CollapsibleRoot.vue'

export { provideCollapsible, useCollapsible } from './CollapsibleRoot.vue'

export type { CollapsibleActivatorProps, CollapsibleActivatorSlotProps } from './CollapsibleActivator.vue'
export type { CollapsibleContentProps, CollapsibleContentSlotProps } from './CollapsibleContent.vue'
export type { CollapsibleCueProps, CollapsibleCueSlotProps } from './CollapsibleCue.vue'
export type { CollapsibleContext, CollapsibleRootProps, CollapsibleRootSlotProps } from './CollapsibleRoot.vue'

// Context
import Activator from './CollapsibleActivator.vue'
import Content from './CollapsibleContent.vue'
import Cue from './CollapsibleCue.vue'
import Root from './CollapsibleRoot.vue'

/**
 * A single-item disclosure toggle for showing and hiding content.
 *
 * @see https://0.vuetifyjs.com/components/disclosure/collapsible
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Collapsible } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Collapsible.Root>
 *     <Collapsible.Activator>
 *       <Collapsible.Cue />
 *       Toggle content
 *     </Collapsible.Activator>
 *
 *     <Collapsible.Content>
 *       Content goes here.
 *     </Collapsible.Content>
 *   </Collapsible.Root>
 * </template>
 * ```
 */
export const Collapsible = {
  Root,
  Activator,
  Cue,
  Content,
}
