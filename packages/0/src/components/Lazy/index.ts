export { default as LazyContent } from './LazyContent.vue'
export { default as LazyPlaceholder } from './LazyPlaceholder.vue'
export { provideLazyRoot, useLazyRoot } from './LazyRoot.vue'
export { default as LazyRoot } from './LazyRoot.vue'

export type { LazyContentProps, LazyContentSlotProps } from './LazyContent.vue'
export type { LazyPlaceholderProps, LazyPlaceholderSlotProps } from './LazyPlaceholder.vue'
export type { LazyRootContext, LazyRootProps, LazyRootSlotProps } from './LazyRoot.vue'
export type { LazyContext } from '#v0/composables/useLazy'

// Components
import Content from './LazyContent.vue'
import Placeholder from './LazyPlaceholder.vue'
import Root from './LazyRoot.vue'

/**
 * Lazy component for deferred content rendering based on viewport intersection.
 *
 * @see https://0.vuetifyjs.com/components/lazy
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Lazy } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Lazy.Root>
 *     <Lazy.Placeholder>
 *       <div class="skeleton h-48 w-full" />
 *     </Lazy.Placeholder>
 *
 *     <Lazy.Content>
 *       <ExpensiveComponent />
 *     </Lazy.Content>
 *   </Lazy.Root>
 * </template>
 * ```
 *
 * @example
 * Eager mode (render content immediately):
 * ```vue
 * <template>
 *   <Lazy.Root eager>
 *     <Lazy.Placeholder>
 *       <div class="skeleton" />
 *     </Lazy.Placeholder>
 *
 *     <Lazy.Content>
 *       <div>Renders immediately</div>
 *     </Lazy.Content>
 *   </Lazy.Root>
 * </template>
 * ```
 *
 * @example
 * With root margin for preloading:
 * ```vue
 * <template>
 *   <Lazy.Root root-margin="200px">
 *     <Lazy.Placeholder>
 *       <ImageSkeleton />
 *     </Lazy.Placeholder>
 *
 *     <Lazy.Content>
 *       <img src="large-image.jpg" />
 *     </Lazy.Content>
 *   </Lazy.Root>
 * </template>
 * ```
 */
export const Lazy = {
  /**
   * Root component for lazy loading contexts.
   *
   * @see https://0.vuetifyjs.com/components/lazy#lazyroot
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Lazy } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Lazy.Root>
   *     <Lazy.Placeholder>
   *       <div class="skeleton" />
   *     </Lazy.Placeholder>
   *
   *     <Lazy.Content>
   *       <ExpensiveComponent />
   *     </Lazy.Content>
   *   </Lazy.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Placeholder component shown before content intersects viewport.
   *
   * @see https://0.vuetifyjs.com/components/lazy#lazyplaceholder
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Lazy } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Lazy.Placeholder>
   *     <div class="h-48 w-full animate-pulse bg-gray-200" />
   *   </Lazy.Placeholder>
   * </template>
   * ```
   */
  Placeholder,
  /**
   * Content component shown after viewport intersection.
   *
   * @see https://0.vuetifyjs.com/components/lazy#lazycontent
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Lazy } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Lazy.Content>
   *     <img src="/large-image.jpg" alt="Lazy loaded image" />
   *   </Lazy.Content>
   * </template>
   * ```
   */
  Content,
}
