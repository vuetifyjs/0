export { default as ScrimRoot } from './ScrimRoot.vue'
export type { ScrimRootProps, ScrimRootSlotProps } from './ScrimRoot.vue'

// Components
import Root from './ScrimRoot.vue'

/**
 * Scrim component for overlay backdrops.
 *
 * @see https://0.vuetifyjs.com/components/providers/scrim
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Scrim } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Scrim.Root class="fixed inset-0 bg-black/50" />
 * </template>
 * ```
 */
export const Scrim = {
  /**
   * Root scrim component that integrates with the stack system.
   *
   * @see https://0.vuetifyjs.com/components/providers/scrim
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Scrim } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Scrim.Root class="fixed inset-0 bg-black/50 transition-opacity" />
   * </template>
   * ```
   */
  Root,
}
