export type {
  BPopoverDelay,
  BPopoverPlacement,
  BPopoverProps,
  BPopoverSlotProps,
  BPopoverTrigger,
} from './BPopover.vue'

/**
 * Bootstrap 6 popover. A trigger and a `.popover`, open state on `v-model`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BPopover } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BPopover title="Popover title" text="Popover body" v-slot="{ attrs }">
 *     <button class="btn-solid theme-primary" type="button" v-bind="attrs">
 *       Toggle popover
 *     </button>
 *   </BPopover>
 * </template>
 * ```
 */
export { default as BPopover } from './BPopover.vue'
