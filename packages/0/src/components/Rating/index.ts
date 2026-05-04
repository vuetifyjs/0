export { default as RatingHiddenInput } from './RatingHiddenInput.vue'

export { default as RatingItem } from './RatingItem.vue'

export { default as RatingRoot } from './RatingRoot.vue'
export { provideRatingRoot, useRatingRoot } from './RatingRoot.vue'

export type { RatingHiddenInputProps } from './RatingHiddenInput.vue'
export type { RatingItemProps, RatingItemSlotProps } from './RatingItem.vue'
export type { RatingRootContext, RatingRootProps, RatingRootSlotProps } from './RatingRoot.vue'

// Context
import HiddenInput from './RatingHiddenInput.vue'
import Item from './RatingItem.vue'
import Root from './RatingRoot.vue'

/**
 * Rating component with sub-components for building star/icon rating controls.
 *
 * Provides a headless, accessible rating input with hover preview,
 * half-star support, keyboard navigation, and full ARIA compliance.
 * Uses `createRating` internally for value management and exposes
 * state via data attributes for CSS-only styling.
 *
 * @see https://0.vuetifyjs.com/components/forms/rating
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Rating } from '@vuetify/v0'
 *   import { shallowRef } from 'vue'
 *
 *   const rating = shallowRef(0)
 * </script>
 *
 * <template>
 *   <Rating.Root v-model="rating">
 *     <Rating.Item
 *       v-for="i in 5"
 *       :key="i"
 *       :index="i"
 *       as="button"
 *       v-slot="{ state }"
 *     >
 *       {{ state === 'full' ? '★' : '☆' }}
 *     </Rating.Item>
 *   </Rating.Root>
 * </template>
 * ```
 */
export const Rating = {
  /**
   * Root component for ratings.
   *
   * Creates rating context, provides it to child components, and
   * bridges v-model. Handles hover tracking, keyboard navigation,
   * and ARIA attributes. When `name` prop is provided, automatically
   * renders a hidden input for form submission. Supports both whole
   * and half-star modes via the `half` prop.
   *
   * @see https://0.vuetifyjs.com/components/forms/rating
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Rating } from '@vuetify/v0'
   *   import { shallowRef } from 'vue'
   *
   *   const rating = shallowRef(0)
   * </script>
   *
   * <template>
   *   <Rating.Root v-model="rating" :size="5">
   *     <Rating.Item
   *       v-for="i in 5"
   *       :key="i"
   *       :index="i"
   *       as="button"
   *       v-slot="{ state }"
   *     >
   *       {{ state === 'full' ? '★' : '☆' }}
   *     </Rating.Item>
   *   </Rating.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Individual rating item (star/icon).
   *
   * Consumes Rating context and computes its visual state from the
   * current or hovered value. Exposes state via data attributes
   * (`data-state`, `data-highlighted`) for CSS-only styling. Handles
   * pointer events for hover preview and click to commit. When half
   * mode is active, detects left/right half of the element for
   * half-star hover precision.
   *
   * @see https://0.vuetifyjs.com/components/forms/rating#anatomy
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Rating } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Rating.Item
   *     :index="1"
   *     as="button"
   *     class="[&[data-state=full]]:text-amber-500 [&[data-state=empty]]:text-gray-300"
   *     v-slot="{ state }"
   *   >
   *     {{ state === 'full' ? '★' : state === 'half' ? '⯨' : '☆' }}
   *   </Rating.Item>
   * </template>
   * ```
   */
  Item,
  /**
   * Hidden native input for form submission.
   *
   * Auto-rendered by Root when the `name` prop is provided. Submits
   * the current numeric rating value as part of the form. Can also
   * be used explicitly for custom form integration scenarios where
   * you need manual control over the hidden input placement.
   *
   * @see https://0.vuetifyjs.com/components/forms/rating
   * @internal
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Rating } from '@vuetify/v0'
   *   import { shallowRef } from 'vue'
   *
   *   const rating = shallowRef(3)
   * </script>
   *
   * <template>
   *   <Rating.Root v-model="rating" name="review-rating">
   *     <Rating.Item
   *       v-for="i in 5"
   *       :key="i"
   *       :index="i"
   *       as="button"
   *       v-slot="{ state }"
   *     >
   *       {{ state === 'full' ? '★' : '☆' }}
   *     </Rating.Item>
   *   </Rating.Root>
   * </template>
   * ```
   */
  HiddenInput,
}
