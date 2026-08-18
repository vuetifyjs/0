export type { EmPopoverActivatorProps } from './EmPopoverActivator.vue'
export { default as EmPopoverActivator } from './EmPopoverActivator.vue'
export type { EmPopoverContentProps } from './EmPopoverContent.vue'
export { default as EmPopoverContent } from './EmPopoverContent.vue'
export type { EmPopoverProps } from './EmPopover.vue'

// Context
import Root from './EmPopover.vue'
import Activator from './EmPopoverActivator.vue'
import Content from './EmPopoverContent.vue'

/**
 * Anchored overlay. Owns the open state and positions its content against the activator.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmPopoverActivator`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmPopover } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmPopover>
 *     <EmPopover.Activator />
 *
 *     <EmPopover.Content />
 *   </EmPopover>
 * </template>
 * ```
 */
export const EmPopover = Object.assign(Root, {
  /** Trigger that opens the popover. */
  Activator,
  /** The floating surface. */
  Content,
})
