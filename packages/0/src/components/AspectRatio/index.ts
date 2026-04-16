export type { AspectRatioProps, AspectRatioSlotProps } from './AspectRatio.vue'

/**
 * Primitive that reserves a box with a fixed width-to-height ratio.
 *
 * @see https://0.vuetifyjs.com/components/primitives/aspect-ratio
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { AspectRatio } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <AspectRatio :ratio="16 / 9">
 *     <img src="/photo.jpg" class="w-full h-full object-cover" />
 *   </AspectRatio>
 * </template>
 * ```
 */
export { default as AspectRatio } from './AspectRatio.vue'
