export type {
  BTooltipDelay,
  BTooltipPlacement,
  BTooltipProps,
  BTooltipSlotProps,
  BTooltipTrigger,
} from './BTooltip.vue'

/**
 * Bootstrap 6 tooltip. A trigger and a `.tooltip`, open state on `v-model`.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BTooltip } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BTooltip text="Tooltip on top" v-slot="{ attrs }">
 *     <button class="btn-solid theme-primary" type="button" v-bind="attrs">
 *       Tooltip on top
 *     </button>
 *   </BTooltip>
 * </template>
 * ```
 */
export { default as BTooltip } from './BTooltip.vue'
