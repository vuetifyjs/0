export { default as ImageFallback } from './ImageFallback.vue'
export { default as ImageImg } from './ImageImg.vue'
export { default as ImagePlaceholder } from './ImagePlaceholder.vue'
export { provideImageRoot, useImageRoot } from './ImageRoot.vue'

export { default as ImageRoot } from './ImageRoot.vue'

export type { ImageFallbackProps, ImageFallbackSlotProps } from './ImageFallback.vue'
export type { ImageImgEmits, ImageImgProps, ImageImgSlotProps } from './ImageImg.vue'
export type { ImagePlaceholderProps, ImagePlaceholderSlotProps } from './ImagePlaceholder.vue'
export type { ImageContext, ImageRootProps, ImageRootSlotProps } from './ImageRoot.vue'

// Context
import Fallback from './ImageFallback.vue'
import Img from './ImageImg.vue'
import Placeholder from './ImagePlaceholder.vue'
import Root from './ImageRoot.vue'

/**
 * Image component with sub-components for managing image loading lifecycle.
 *
 * @see https://0.vuetifyjs.com/components/semantic/image
 */
export const Image = {
  /**
   * Root component for images. Owns the loading state machine and optionally
   * manages lazy loading via IntersectionObserver.
   *
   * @see https://0.vuetifyjs.com/components/semantic/image
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Image } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Image.Root src="/photo.jpg">
   *     <Image.Img alt="A photo" width="800" height="600" />
   *     <Image.Placeholder>Loading...</Image.Placeholder>
   *     <Image.Fallback>Failed to load</Image.Fallback>
   *   </Image.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * The `<img>` element. Reads the gated source from context and reports
   * load/error events.
   *
   * @see https://0.vuetifyjs.com/components/semantic/image
   *
   * @example
   * ```vue
   * <Image.Img alt="Description" width="800" height="600" />
   * ```
   */
  Img,
  /**
   * Placeholder content shown while the image is idle or loading.
   *
   * @see https://0.vuetifyjs.com/components/semantic/image
   *
   * @example
   * ```vue
   * <Image.Placeholder>
   *   <div class="bg-gray-200 animate-pulse" />
   * </Image.Placeholder>
   * ```
   */
  Placeholder,
  /**
   * Fallback content shown when the image fails to load. Exposes `retry()`
   * via slot props.
   *
   * @see https://0.vuetifyjs.com/components/semantic/image
   *
   * @example
   * ```vue
   * <Image.Fallback v-slot="{ retry }">
   *   <button @click="retry">Retry</button>
   * </Image.Fallback>
   * ```
   */
  Fallback,
}
