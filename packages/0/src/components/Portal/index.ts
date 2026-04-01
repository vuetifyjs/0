export type { PortalProps, PortalSlotProps } from './Portal.vue'

/**
 * Renderless teleport wrapper with automatic useStack integration.
 *
 * @see https://0.vuetifyjs.com/components/portal
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Portal } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Portal>
 *     <template #default="{ zIndex }">
 *       <div :style="{ zIndex }">Overlay content</div>
 *     </template>
 *   </Portal>
 * </template>
 * ```
 */
export { default as Portal } from './Portal.vue'
